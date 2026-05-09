const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { admin, db, bucket } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// НАЛАШТУВАННЯ MULTER З ЛІМІТОМ
// Файл буде триматися в memoryStorage, поки не відправиться у Firebase
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 } // Ліміт 2 Мегабайти
});

// ---------------------------------------------------------
// МІДЛВАР ДЛЯ АВТОРИЗАЦІЇ
// ---------------------------------------------------------
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Немає токена авторизації!" });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Записуємо дані юзера (включаючи uid)
        next(); // Пропускаємо далі
    } catch (error) {
        return res.status(403).json({ message: "Недійсний токен!" });
    }
};

// ---------------------------------------------------------
// ЕНДПОІНТ: СТВОРЕННЯ ТОВАРУ (POST /api/products)
// Приймає текст і 1 картинку (поле 'image')
// ---------------------------------------------------------
app.post('/api/products', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, category, condition } = req.body;
        const file = req.file; // Це наша картинка

        if (!title || !price || !file) {
            return res.status(400).json({ message: "Назва, ціна та фото обов'язкові!" });
        }

        // 1. Завантажуємо фото у Firebase Storage
        const fileName = `products/${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
        });

        // Робимо файл публічним, щоб фронтенд міг його показати
        await fileUpload.makePublic();
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // 2. Створюю документ у Firestore
        const newProduct = {
            title,
            price: Number(price),
            description,
            category,
            condition,
            imageUrl: imageUrl, // Посилання на завантажене фото
            sellerId: req.user.uid, // Беру ID з токена авторизації!
            views: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('products').add(newProduct);

        res.status(201).json({
            message: "Товар успішно створено!",
            id: docRef.id,
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error("Помилка створення товару:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// ---------------------------------------------------------
// ЕНДПОІНТ: ОТРИМАННЯ ВСІХ ТОВАРІВ (GET /api/products)
// ---------------------------------------------------------
app.get('/api/products', async (req, res) => {
    try {
        // Беремо категорію з запиту (якщо фронтенд хоче фільтрувати)
        const { category } = req.query;

        let query = db.collection('products').orderBy('createdAt', 'desc');

        // Якщо передали категорію, фільтруємо по ній
        if (category) {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(products);
    } catch (error) {
        console.error("Помилка отримання товарів:", error);
        res.status(500).json({ message: "Помилка сервера при завантаженні товарів" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Бекенд працює на порту ${PORT}`));