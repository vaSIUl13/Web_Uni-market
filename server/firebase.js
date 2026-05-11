const admin = require("firebase-admin");
const path = require("path");

// Перевіряємо, чи існує файл сервісного ключа
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

try {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "unimarket-f3c72.firebasestorage.app"
    });
} catch (error) {
    console.warn("⚠️  serviceAccountKey.json не знайдено!");
    console.warn("   Завантажте його з Firebase Console → Project Settings → Service Accounts");
    console.warn("   та покладіть у папку server/");
    console.warn("");
    console.warn("   Сервер запуститься, але запити до Firebase не працюватимуть.");
    console.warn("");

    // Ініціалізуємо без credentials для розробки (буде fallback)
    admin.initializeApp({
        projectId: "unimarket-f3c72",
        storageBucket: "unimarket-f3c72.firebasestorage.app"
    });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };