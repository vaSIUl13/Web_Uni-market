const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // ВСТАВ СЮДИ storageBucket З ТОГО КОНФІГУ, ЩО ТИ СКИНУВ ВИЩЕ:
    storageBucket: "https://unimarket-f3c72.firebasestorage.app"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };