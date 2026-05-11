import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

/**
 * Завантажує зображення товару до Firebase Storage
 * @param file - Об'єкт файлу з інпуту
 * @param folder - Папка в сховищі (за замовчуванням 'products')
 * @returns Promise з публічним URL завантаженого файлу
 */
export const uploadProductImage = async (file: File, folder: string = "products"): Promise<string> => {
  try {
    // Створюємо унікальне ім'я файлу, щоб уникнути перетирання (напр. 1715284000_photo.jpg)
    const fileName = `${Date.now()}_${file.name}`;
    
    // Створюємо посилання на місце в сховищі
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Завантажуємо файл
    const snapshot = await uploadBytes(storageRef, file);

    // Отримуємо та повертаємо пряме посилання на файл
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Помилка при завантаженні зображення:", error);
    throw new Error("Не вдалося завантажити зображення");
  }
};