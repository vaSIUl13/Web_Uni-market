const admin = require("firebase-admin");
// Підключаю файл
const serviceAccount = require("./serviceAccountKey.json");

// Ініціалізація Firebase для сервера
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Доступ до Firestore
const db = admin.firestore();

module.exports = db;