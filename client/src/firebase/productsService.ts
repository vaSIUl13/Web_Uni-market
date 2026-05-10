/**
 * Сервіс для роботи з товарами через бекенд API
 * Замість прямого доступу до Firestore, всі операції йдуть через Express сервер
 */

import { 
  fetchProducts as apiFetchProducts, 
  fetchProductById as apiFetchProductById,
  createProduct as apiCreateProduct,
  deleteProduct as apiDeleteProduct,
  searchProducts as apiSearchProducts,
  fetchMyProducts as apiFetchMyProducts,
  rateProduct as apiRateProduct
} from "../api/api";
import type { Product } from "./types";

/**
 * Створення товару через бекенд API
 */
export const createProduct = async (
  productData: {
    title: string;
    price: number;
    description?: string;
    category?: any;
    condition?: any;
  },
  imageFile: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("title", productData.title);
  formData.append("price", String(productData.price));
  if (productData.description) formData.append("description", productData.description);
  if (productData.category) formData.append("category", JSON.stringify(productData.category));
  if (productData.condition) formData.append("condition", JSON.stringify(productData.condition));
  formData.append("image", imageFile);

  const result = await apiCreateProduct(formData);
  return result.id;
};

/**
 * Отримує список товарів з бекенду
 */
export const getProducts = async (
  categoryText?: string,
  conditionText?: string,
  pageSize: number = 12
): Promise<Product[]> => {
  try {
    const products = await apiFetchProducts(categoryText, conditionText, pageSize);
    return products as Product[];
  } catch (error) {
    console.error("Помилка при отриманні товарів:", error);
    return [];
  }
};

/**
 * Отримання одного товару за ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const product = await apiFetchProductById(id);
    return product as Product;
  } catch (error) {
    console.error("Помилка отримання товару:", error);
    return null;
  }
};

/**
 * Видалення товару через бекенд
 */
export const deleteProduct = async (id: string, _imageUrl?: string) => {
  try {
    await apiDeleteProduct(id);
  } catch (error) {
    console.error("Помилка видалення:", error);
    throw error;
  }
};

/**
 * Отримує товари поточного користувача
 */
export const getUserProducts = async (): Promise<Product[]> => {
  try {
    return await apiFetchMyProducts() as Product[];
  } catch (error) {
    console.error("Помилка отримання товарів користувача:", error);
    return [];
  }
};

/**
 * Пошук товарів за назвою
 */
export const searchProducts = async (searchText: string): Promise<Product[]> => {
  try {
    return await apiSearchProducts(searchText) as Product[];
  } catch (error) {
    console.error("Помилка пошуку:", error);
    return [];
  }
};

/**
 * Alias для getUserProducts
 */
export const getMyProducts = getUserProducts;

/**
 * Лічильник переглядів — тепер інкрементиться автоматично при GET /api/products/:id
 * Цю функцію залишаємо як no-op для зворотної сумісності
 */
export const incrementProductViews = async (_id: string) => {
  // Перегляди рахуються автоматично на бекенді при getProductById
};

/**
 * Оцінка товару
 */
export const rateProduct = async (id: string, rating: number): Promise<any> => {
  return await apiRateProduct(id, rating);
};

// ============================
// Обране (Favorites) — залишаємо через клієнтський Firebase SDK,
// бо немає ендпоінтів на бекенді для цього
// ============================
import { 
  collection, getDocs, query, where, 
  doc, setDoc, deleteDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";
import { getAuth } from "firebase/auth";

export const addToFavorites = async (productId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Авторизуйтесь, щоб додати в обране");

  const favoriteId = `${user.uid}_${productId}`;
  const favRef = doc(db, "favorites", favoriteId);
  await setDoc(favRef, {
    userId: user.uid,
    productId,
    addedAt: serverTimestamp()
  });
};

export const removeFromFavorites = async (productId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const favoriteId = `${user.uid}_${productId}`;
  await deleteDoc(doc(db, "favorites", favoriteId));
};

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