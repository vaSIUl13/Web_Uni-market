const express = require('express');
const cors = require('cors');

const app = express();

// Налаштування
app.use(cors()); // Дозвіл фронтенду робити до нас запити
app.use(express.json()); // Сервер читає JSON-дані

// Перший API-ендпоінт (на основі макету з Figma)
app.post('/api/products', (req, res) => {
    // Витяг даних, які пришле фронтенд
    const { title, price, description, category, condition, images } = req.body;

    // Базова перевірка (чи всі поля заповнені)
    if (!title || !price || !category) {
        return res.status(400).json({ message: "Назва, ціна та категорія є обов'язковими!" });
    }

    // ТУТ БУДЕ КОД ЗБЕРЕЖЕННЯ В БАЗУ (додам його наступним кроком)
    console.log("Ура! Прийшли дані від фронтенду:", req.body);

    // Відповідь фронтенду, що все ок
    res.status(201).json({
        message: "Оголошення успішно створено на бекенді!",
        productInfo: { title, price, condition }
    });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер успішно запущено! Він слухає порт ${PORT}`);
});