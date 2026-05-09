import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    setDoc,
    doc,
    query, 
    where, 
    orderBy, 
    limit, 
    deleteDoc,
    updateDoc,
    increment,
    serverTimestamp 
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "./config";
import { uploadProductImage } from "./storageService";
import type { Product } from "./types";
import { getAuth } from "firebase/auth"; 

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

/**
 * Отримує товари тільки поточного авторизованого користувача
 */
export const getUserProducts = async (): Promise<Product[]> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return [];

    try {
        const q = query(
            collection(db, "products"),
            where("sellerId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
        console.error("Помилка отримання товарів користувача:", error);
        return [];
    }
};

/**
 * Оновлює дані існуючого товару
 */
export const updateProduct = async (id: string, updateData: Partial<Product>) => {
    try {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, updateData);
        console.log("Товар оновлено успішно");
    } catch (error) {
        console.error("Помилка оновлення товару:", error);
        throw error;
    }
};

/**
 * Пошук товарів за початком назви
 */
export const searchProducts = async (searchText: string): Promise<Product[]> => {
    try {
        const q = query(
            collection(db, "products"),
            where("title", ">=", searchText),
            where("title", "<=", searchText + "\uf8ff"),
            limit(10)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
        console.error("Помилка пошуку:", error);
        return [];
    }
};

/**
 * Отримує оголошення конкретного користувача
 */
export const getMyProducts = async (): Promise<Product[]> => {
    const auth = getAuth();
    if (!auth.currentUser) return [];

    try {
        const q = query(
            collection(db, "products"),
            where("sellerId", "==", auth.currentUser.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
        console.error("Помилка отримання моїх товарів:", error);
        return [];
    }
};

/* Лічильник переглядів */
export const incrementProductViews = async (id: string) => {
    try {
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error("Помилка лічильника переглядів:", error);
    }
};

/**
 * Робота з "Обраним" (Favorites)
 */

/**
 * Додає товар у список обраного для конкретного користувача.
 * Ми використовуємо спеціальний ID документа (userId_productId), 
 * щоб уникнути дублікатів.
 */
export const addToFavorites = async (productId: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Авторизуйтесь, щоб додати в обране");

    try {
        // Створюємо унікальний ID для документа: UID_PID
        const favoriteId = `${user.uid}_${productId}`;
        const favRef = doc(db, "favorites", favoriteId);

        await setDoc(favRef, {
            userId: user.uid,
            productId: productId,
            addedAt: serverTimestamp()
        });
        console.log("Товар додано в обране");
    } catch (error) {
        console.error("Помилка додавання в обране:", error);
        throw error;
    }
};

/**
 * Видаляє товар зі списку обраного
 */
export const removeFromFavorites = async (productId: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    try {
        const favoriteId = `${user.uid}_${productId}`;
        await deleteDoc(doc(db, "favorites", favoriteId));
        console.log("Товар видалено з обраного");
    } catch (error) {
        console.error("Помилка видалення з обраного:", error);
    }
};

/**
 * Отримує список ID товарів, які користувач додав у обране.
 */
export const getUserFavoriteIds = async (): Promise<string[]> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return [];

    try {
        const q = query(
            collection(db, "favorites"),
            where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data().productId);
    } catch (error) {
        console.error("Помилка отримання ID обраних товарів:", error);
        return [];
    }
};