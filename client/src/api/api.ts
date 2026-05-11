import { getAuth } from "firebase/auth";

const API_BASE = "/api";

/**
 * Отримує Firebase ID token для авторизованих запитів
 */
const getAuthToken = async (): Promise<string | null> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

/**
 * Базова обгортка для fetch з обробкою помилок
 */
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Невідома помилка сервера" }));
    throw new Error(errorData.message || `HTTP Error ${response.status}`);
  }

  return response.json();
};

// ============================
// ТОВАРИ — CRUD через бекенд
// ============================

/**
 * Отримати список товарів (з фільтрами)
 */
export const fetchProducts = async (
  category?: string,
  condition?: string,
  limit: number = 12
): Promise<any[]> => {
  const params = new URLSearchParams();
  if (category && category !== "Всі") params.append("category", category);
  if (condition && condition !== "Всі") params.append("condition", condition);
  params.append("limit", String(limit));

  const queryString = params.toString();
  return apiFetch(`${API_BASE}/products${queryString ? `?${queryString}` : ""}`);
};

/**
 * Отримати один товар за ID
 */
export const fetchProductById = async (id: string): Promise<any> => {
  return apiFetch(`${API_BASE}/products/${id}`);
};

/**
 * Пошук товарів за назвою
 */
export const searchProducts = async (query: string): Promise<any[]> => {
  if (!query.trim()) return [];
  return apiFetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
};

/**
 * Створити товар (потрібна авторизація)
 */
export const createProduct = async (formData: FormData): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Потрібна авторизація!");

  return apiFetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // FormData з title, price, description, category, condition, image
  });
};

/**
 * Видалити товар (потрібна авторизація, тільки власник)
 */
export const deleteProduct = async (id: string): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Потрібна авторизація!");

  return apiFetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Оцінити товар (потрібна авторизація)
 */
export const rateProduct = async (id: string, rating: number): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Потрібна авторизація!");

  return apiFetch(`${API_BASE}/products/${id}/rate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rating }),
  });
};

/**
 * Отримати товари поточного користувача (потрібна авторизація)
 */
export const fetchMyProducts = async (): Promise<any[]> => {
  const token = await getAuthToken();
  if (!token) return [];

  return apiFetch(`${API_BASE}/my-products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ============================
// ЗАМОВЛЕННЯ (Orders)
// ============================

export const createOrder = async (orderData: any): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Потрібна авторизація для оформлення замовлення!");

  return apiFetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
};

export const fetchMyOrders = async (): Promise<any[]> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Потрібна авторизація!");

  return apiFetch(`${API_BASE}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ============================
// ОБРАНЕ (Favorites)
// ============================

export const fetchFavorites = async (): Promise<string[]> => {
  const token = await getAuthToken();
  if (!token) return [];

  return apiFetch(`${API_BASE}/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addFavorite = async (productId: string): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Потрібна авторизація");

  return apiFetch(`${API_BASE}/favorites/${productId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeFavorite = async (productId: string): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Потрібна авторизація");

  return apiFetch(`${API_BASE}/favorites/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
