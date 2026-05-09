const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { admin, db, bucket } = require('./firebase');

const app = express();
// Проста мідлвар для логування кожного запиту з часом, методом і URL
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});
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

        // ----- ВАЛІДАЦІЯ ДАНИХ -----

        // 1. Перевірка обов'язкових полів
        if (!file) {
            return res.status(400).json({ message: "Фото товару обов'язкове!" });
        }

        // 2. Валідація заголовка
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: "Заголовок товару повинен бути непустим рядком!" });
        }

        // 3. Валідація ціни
        if (!price) {
            return res.status(400).json({ message: "Ціна товару обов'язкова!" });
        }

        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ message: "Ціна повинна бути числом більше нуля!" });
        }

        // ----- КІНЕЦЬ ВАЛІДАЦІЇ -----

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
// Підтримує фільтрацію за category.text через query-параметр ?category=Гаджети
// Повертає товари, відсортовані за createdAt (спадний порядок)
// ---------------------------------------------------------
app.get('/api/products', async (req, res) => {
    try {
        // Беремо категорію з query-параметра (напр. ?category=Гаджети)
        const { category } = req.query;

        // Починаємо з базового запиту, сортуємо за createdAt в спадному порядку
        let query = db.collection('products').orderBy('createdAt', 'desc');

        // Якщо передали категорію, фільтруємо по полю category.text
        // Важливо: категорія має структуру { text, textClass, bgClass }
        if (category) {
            query = query.where('category.text', '==', category);
        }

        // Отримуємо документи
        const snapshot = await query.get();
        
        // Трансформуємо у масив об'єктів з id документа та всіма полями
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

// ---------------------------------------------------------
// ЕНДПОІНТ: ОТРИМАННЯ ОДНОГО ТОВАРУ (GET /api/products/:id)
// Знаходить товар за його ID і повертає його дані
// ---------------------------------------------------------
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Дістаємо документ із Firestore за його ID
        const docRef = db.collection('products').doc(id);
        // Автоматичне збільшення переглядів при кожному запиті
        await docRef.update({ views: admin.firestore.FieldValue.increment(1) });
        const docSnap = await docRef.get();

        // Перевіряємо, чи документ існує
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Товар не знайдено!" });
        }

        // Повертаємо документ з його ID та всіма полями
        const product = {
            id: docSnap.id,
            ...docSnap.data()
        };

        res.status(200).json(product);

    } catch (error) {
        console.error("Помилка отримання товару:", error);
        res.status(500).json({ message: "Помилка сервера при завантаженні товару" });
    }
});

// ---------------------------------------------------------
// ЕНДПОІНТ: ВИДАЛЕННЯ ТОВАРУ (DELETE /api/products/:id)
// Тільки власник товару може його видалити (перевіра sellerId)
// ---------------------------------------------------------
app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid; // ID авторизованого користувача

        // 1. Дістаємо документ із Firestore за його ID
        const docRef = db.collection('products').doc(id);
        const docSnap = await docRef.get();

        // 2. Перевіряємо, чи документ існує
        if (!docSnap.exists()) {
            return res.status(404).json({ message: "Товар не знайдено!" });
        }

        // 3. Отримуємо дані документа
        const productData = docSnap.data();

        // 4. Перевіряємо, чи користувач є власником (sellerId збігається з req.user.uid)
        if (productData.sellerId !== userId) {
            return res.status(403).json({ message: "У вас немає прав видалити цей товар!" });
        }

        // 5. Якщо власник — видаляємо документ
        await docRef.delete();

        res.status(200).json({ message: "Товар успішно видалено!" });

    } catch (error) {
        console.error("Помилка видалення товару:", error);
        res.status(500).json({ message: "Помилка сервера при видаленні товару" });
    }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ініціалізація Gemini (заміни 'YOUR_API_KEY' на свій ключ)
const genAI = new GoogleGenerativeAI("AIzaSyAY2OPTN_IiL_-2PfFMW0CRh6nWgEAnjek");

// ЕНДПОІНТ: ГЕНЕРАЦІЯ ОПИСУ ЧЕРЕЗ ШІ (Критерій 7)
app.post('/api/ai/generate-description', async (req, res) => {
    try {
        const { title, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Назва товару обов'язкова для генерації!" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Ти професійний копірайтер маркетплейсу для студентів UniMarket. 
        Напиши короткий, привабливий та молодіжний опис для оголошення: "${title}". 
        Категорія товару: ${category || 'Загальна'}. 
        Мова: українська. Опис має бути не довшим за 3 речення.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ description: text });

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: "ШІ тимчасово приліг відпочити. Спробуйте пізніше." });
    }
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Бекенд працює на порту ${PORT}`));