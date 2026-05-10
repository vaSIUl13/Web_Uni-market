const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { admin, db, bucket } = require('./firebase');

const app = express();

// Логування кожного запиту
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// НАЛАШТУВАННЯ MULTER З ЛІМІТОМ
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
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Недійсний токен!" });
    }
};

// ---------------------------------------------------------
// ЕНДПОІНТ: СТВОРЕННЯ ТОВАРУ (POST /api/products)
// ---------------------------------------------------------
app.post('/api/products', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, price, description, category, condition } = req.body;
        const file = req.file;

        // Валідація
        if (!file) {
            return res.status(400).json({ message: "Фото товару обов'язкове!" });
        }
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: "Заголовок товару повинен бути непустим рядком!" });
        }
        if (!price) {
            return res.status(400).json({ message: "Ціна товару обов'язкова!" });
        }
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ message: "Ціна повинна бути числом більше нуля!" });
        }

        // 1. Завантажуємо фото у Firebase Storage
        const fileName = `products/${Date.now()}_${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
        });

        await fileUpload.makePublic();
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // 2. Парсимо category та condition (можуть прийти як JSON strings)
        let parsedCategory = category;
        let parsedCondition = condition;
        try {
            if (typeof category === 'string') parsedCategory = JSON.parse(category);
        } catch (e) { /* залишаємо як є */ }
        try {
            if (typeof condition === 'string') parsedCondition = JSON.parse(condition);
        } catch (e) { /* залишаємо як є */ }

        // 3. Створюємо документ у Firestore
        const newProduct = {
            title,
            price: priceNum,
            description: description || '',
            category: parsedCategory,
            condition: parsedCondition,
            imageUrl,
            sellerId: req.user.uid,
            sellerName: req.user.name || req.user.email || 'Анонімний студент',
            views: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('products').add(newProduct);

        res.status(201).json({
            message: "Товар успішно створено!",
            id: docRef.id,
            imageUrl
        });

    } catch (error) {
        console.error("Помилка створення товару:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// ---------------------------------------------------------
// ЕНДПОІНТ: ОТРИМАННЯ ВСІХ ТОВАРІВ (GET /api/products)
// Підтримує: ?category=Гаджети&condition=Новий&limit=12
// ---------------------------------------------------------
app.get('/api/products', async (req, res) => {
    try {
        const { category, condition, limit: limitParam } = req.query;
        const pageSize = parseInt(limitParam) || 12;

        let query = db.collection('products').orderBy('createdAt', 'desc').limit(pageSize);

        if (category && category !== 'Всі') {
            query = query.where('category.text', '==', category);
        }

        const snapshot = await query.get();

        let products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Фільтр condition на стороні сервера (Firestore не підтримує два inequality фільтри)
        if (condition && condition !== 'Всі') {
            products = products.filter(p => 
                p.condition?.text === condition || p.conditionBadge?.text === condition
            );
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Помилка отримання товарів:", error);
        res.status(500).json({ message: "Помилка сервера при завантаженні товарів" });
    }
});

// ---------------------------------------------------------
// ЕНДПОІНТ: ПОШУК ТОВАРІВ (GET /api/products/search?q=...)
// ---------------------------------------------------------
app.get('/api/products/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(200).json([]);
        }

        const searchText = q.trim();
        const snapshot = await db.collection('products')
            .where('title', '>=', searchText)
            .where('title', '<=', searchText + '\uf8ff')
            .limit(10)
            .get();

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(products);
    } catch (error) {
        console.error("Помилка пошуку:", error);
        res.status(500).json({ message: "Помилка сервера при пошуку" });
    }
});

// ---------------------------------------------------------
// ЕНДПОІНТ: ОТРИМАННЯ ОДНОГО ТОВАРУ (GET /api/products/:id)
// ---------------------------------------------------------
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const docRef = db.collection('products').doc(id);
        await docRef.update({ views: admin.firestore.FieldValue.increment(1) });
        const docSnap = await docRef.get();

        // Firebase Admin SDK: exists — це property, не метод
        if (!docSnap.exists) {
            return res.status(404).json({ message: "Товар не знайдено!" });
        }

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
// ЕНДПОІНТ: ОЦІНКА ТОВАРУ (POST /api/products/:id/rate)
// ---------------------------------------------------------
app.post('/api/products/:id/rate', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const userId = req.user.uid;

        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Оцінка повинна бути числом від 1 до 5" });
        }

        const docRef = db.collection('products').doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ message: "Товар не знайдено!" });
        }

        // Беремо поточні дані рейтингу, або створюємо дефолтні
        const productData = docSnap.data();
        const currentRatings = productData.ratings || {}; // { "userId1": 5, "userId2": 4 }
        
        // Додаємо або оновлюємо оцінку від цього користувача
        currentRatings[userId] = rating;

        // Рахуємо нову середню оцінку та кількість
        const reviewsCount = Object.keys(currentRatings).length;
        const sum = Object.values(currentRatings).reduce((a, b) => a + b, 0);
        const averageRating = sum / reviewsCount;

        // Оновлюємо документ
        await docRef.update({
            ratings: currentRatings,
            rating: Number(averageRating.toFixed(1)),
            reviewsCount: reviewsCount
        });

        res.status(200).json({ 
            message: "Оцінка збережена!", 
            rating: Number(averageRating.toFixed(1)),
            reviewsCount 
        });

    } catch (error) {
        console.error("Помилка оцінки товару:", error);
        res.status(500).json({ message: "Помилка сервера при оцінці товару" });
    }
});

// ---------------------------------------------------------
// ЕНДПОІНТ: ВИДАЛЕННЯ ТОВАРУ (DELETE /api/products/:id)
// ---------------------------------------------------------
app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const docRef = db.collection('products').doc(id);
        const docSnap = await docRef.get();

        // Firebase Admin SDK: exists — це property, не метод
        if (!docSnap.exists) {
            return res.status(404).json({ message: "Товар не знайдено!" });
        }

        const productData = docSnap.data();

        if (productData.sellerId !== userId) {
            return res.status(403).json({ message: "У вас немає прав видалити цей товар!" });
        }

        // Видаляємо фото зі Storage якщо є
        if (productData.imageUrl) {
            try {
                const fileName = productData.imageUrl.split(`${bucket.name}/`)[1];
                if (fileName) {
                    await bucket.file(fileName).delete();
                }
            } catch (e) {
                console.warn("Не вдалося видалити фото:", e.message);
            }
        }

        await docRef.delete();

        res.status(200).json({ message: "Товар успішно видалено!" });

    } catch (error) {
        console.error("Помилка видалення товару:", error);
        res.status(500).json({ message: "Помилка сервера при видаленні товару" });
    }
});

// ---------------------------------------------------------
// ЕНДПОІНТ: ТОВАРИ ПОТОЧНОГО КОРИСТУВАЧА (GET /api/my-products)
// ---------------------------------------------------------
app.get('/api/my-products', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;

        const snapshot = await db.collection('products')
            .where('sellerId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(products);
    } catch (error) {
        console.error("Помилка отримання товарів користувача:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Бекенд працює на порту ${PORT}`));