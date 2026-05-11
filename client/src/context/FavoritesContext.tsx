import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchFavorites as getApiFavs, addFavorite as addApiFav, removeFavorite as rmApiFav } from "../api/api";

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const ids = await getApiFavs();
          setFavoriteIds(ids);
        } catch (error) {
          console.error("Помилка завантаження обраного", error);
        }
      } else {
        setFavoriteIds([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (productId: string) => {
    const auth = getAuth();
    if (!auth.currentUser) {
      alert("Будь ласка, авторизуйтесь, щоб зберігати товари!");
      return;
    }

    const currentlyFavorite = favoriteIds.includes(productId);
    
    // Оптимістичне оновлення UI
    setFavoriteIds(prev => 
      currentlyFavorite ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    try {
      if (currentlyFavorite) {
        await rmApiFav(productId);
      } else {
        await addApiFav(productId);
      }
    } catch (error) {
      console.error("Помилка зміни обраного", error);
      // Відкат у разі помилки
      setFavoriteIds(prev => 
        currentlyFavorite ? [...prev, productId] : prev.filter(id => id !== productId)
      );
      alert("Сталася помилка при збереженні.");
    }
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
