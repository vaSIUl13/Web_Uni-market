import { Timestamp } from "firebase/firestore";

// Інтерфейс для категорій (як у твоїх моках)
export interface Category {
  text: string;
  textClass: string;
  bgClass: string;
}

// Інтерфейс для бейджів стану (Новий/БВ)
export interface ConditionBadge {
  text: string;
  icon: string;
  bgClass: string;
  textClass: string;
}

// Основний інтерфейс продукту
export interface Product {
  id?: string;                // ID документа у Firestore
  title: string;
  price: string;              // Наприклад: "80 грн"
  oldPrice?: string;          // Опціонально для знижок
  imageUrl: string;           // Посилання зі Storage
  category: Category;
  sellerId: string;           // UID користувача з Firebase Auth
  sellerName: string;         // Для швидкого відображення без зайвих запитів
  location: string;
  conditionBadge: ConditionBadge;
  topBadge?: {
    text: string;
    bgClass: string;
  };
  createdAt: Timestamp;       // Серверний час створення
  views?: number;             // Опціонально для статистики популярності
}

export interface UserProfile {
    uid: string;                // ID з Firebase Auth
    displayName: string;        // Прізвище та ім'я
    email: string;
    university: string;         // Наприклад, "Львівська Політехніка"
    rating: number;             // На основі твоїх мок-даних (напр. 4.9)
    reviewsCount: number;       // Кількість відгуків
    avatarUrl?: string;         // Фото профілю
    phoneNumber?: string;       // Для зв'язку через месенджери
    createdAt: Timestamp;
  }