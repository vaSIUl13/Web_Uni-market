import React, { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { getProductById } from '../firebase/productsService';
import ProductCard from '../components/ui/ProductCard';
import type { Product } from '../firebase/types';

const FavoritesPage = () => {
  const { favoriteIds, loading: favLoading } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favLoading) return;
      
      if (favoriteIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = favoriteIds.map(id => getProductById(id));
        const results = await Promise.all(promises);
        // Filter out nulls if any product was deleted
        const validProducts = results.filter((p): p is Product => p !== null);
        setProducts(validProducts);
      } catch (error) {
        console.error("Помилка при завантаженні улюблених товарів", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds, favLoading]);

  if (favLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#3b63f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-8">Улюблені товари</h1>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-300 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Немає збережених товарів</h2>
            <p className="text-gray-500 max-w-sm">Додавайте товари в улюблені, натискаючи на сердечко, щоб повернутися до них пізніше.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.id}>
                <ProductCard
                  id={product.id!}
                  imageUrl={product.imageUrl || ''}
                  title={product.title}
                  price={product.price}
                  sellerName={product.sellerName}
                  category={product.category || { text: 'Інше', bgClass: 'bg-gray-100', textClass: 'text-gray-600' }}
                  rating={product.rating}
                  reviewsCount={product.reviewsCount}
                  views={product.views}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
