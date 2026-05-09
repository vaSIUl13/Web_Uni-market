import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc,
    query, 
    where, 
    orderBy, 
    limit, 
    deleteDoc,
    serverTimestamp 
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "./config";
import { uploadProductImage } from "./storageService";
import type { Product } from "./types";
import { getAuth } from "firebase/auth"; // Додаємо цей імпорт

  /**
   * 1. Створення товару (Завдання 4.1)
   */
export const createProduct = async (
    productData: Omit<Product, "id" | "imageUrl" | "createdAt" | "sellerId" | "sellerName">, 
    imageFile: File
): Promise<string> => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    // Порада: Перевірка на auth прямо тут
    if (!user) {
      throw new Error("Користувач не авторизований. Створення товару неможливе.");
    }
  
    try {
      // 1. Завантажуємо фото
      const imageUrl = await uploadProductImage(imageFile);
  
      // 2. Зберігаємо в Firestore, автоматично додаючи дані автора
      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        imageUrl,
        sellerId: user.uid,        // Беремо UID з об'єкта авторизації
        sellerName: user.displayName || "Анонімний студент",
        createdAt: serverTimestamp(),
        views: 0
      });
  
      return docRef.id;
    } catch (error) {
      console.error("Помилка створення товару:", error);
      throw error;
    }
};
  
/**
 * Отримує список товарів з лімітом (12 штук)
 */
export const getProducts = async (
    categoryText?: string, 
    conditionText?: string,
    pageSize: number = 12 // Додаємо параметр ліміту
): Promise<Product[]> => {
    try {
        // Початковий запит із сортуванням та лімітом
        let q = query(
            collection(db, "products"), 
            orderBy("createdAt", "desc"),
            limit(pageSize) 
        );
    
        // Фільтр за категорією
        if (categoryText && categoryText !== "Всі") {
            q = query(q, where("category.text", "==", categoryText));
        }
    
        // Фільтр за станом
        if (conditionText && conditionText !== "Всі") {
            q = query(q, where("conditionBadge.text", "==", conditionText));
        }
    
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
      console.error("Помилка при отриманні товарів:", error);
      return [];
    }
};
  
  /**
   * 3. Отримання одного товару за ID (Для детальної сторінки)
   */
export const getProductById = async (id: string): Promise<Product | null> => {
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }
        return null;
    } catch (error) {
        console.error("Помилка отримання товару:", error);
        return null;
    }
};
  
  /**
   * 4. Видалення товару та його фото (Повний CRUD)
   */
export const deleteProduct = async (id: string, imageUrl: string) => {
    try {
        await deleteDoc(doc(db, "products", id));
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error) {
        console.error("Помилка видалення:", error);
    }
};


  