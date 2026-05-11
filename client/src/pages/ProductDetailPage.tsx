import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, rateProduct } from '../firebase/productsService';
import { getAuth } from 'firebase/auth';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [error, setError] = useState('');
  
  const auth = getAuth();
  const user = auth.currentUser;
  
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          setError('Товар не знайдено');
        }
      } catch (err) {
        setError('Помилка завантаження товару');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleRate = async (ratingValue: number) => {
    if (!user) {
      alert("Авторизуйтесь, щоб оцінити товар!");
      return;
    }
    
    if (!id) return;

    setRatingLoading(true);
    try {
      const response = await rateProduct(id, ratingValue);
      // Оновлюємо локальний стан
      setProduct((prev: any) => ({
        ...prev,
        rating: response.rating,
        reviewsCount: response.reviewsCount
      }));
      alert("Дякуємо за оцінку!");
    } catch (err: any) {
      alert(err.message || "Помилка при оцінці");
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#3b63f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "Товар не знайдено"}</h2>
        <button onClick={() => navigate('/catalog')} className="bg-[#3b63f6] text-white px-6 py-3 rounded-xl font-semibold">
          Повернутися до каталогу
        </button>
      </div>
    );
  }

  const currentRating = product.rating || 0;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-4">
      <div className="max-w-[1000px] mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Фото */}
        <div className="md:w-1/2 h-[400px] md:h-auto bg-gray-100 relative">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80";
            }}
          />
          {product.category && (
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${product.category.bgClass} ${product.category.textClass}`}>
              {product.category.text}
            </div>
          )}
        </div>

        {/* Деталі */}
        <div className="md:w-1/2 p-8 lg:p-10 flex flex-col">
          <h1 className="text-3xl font-extrabold text-[#1e293b] mb-4 leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="text-3xl font-extrabold text-[#3b63f6]">
              {product.price} грн
            </div>
            
            {product.condition && (
              <div className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${product.condition.bgClass || product.conditionBadge?.bgClass || 'bg-gray-100'} ${product.condition.textClass || product.conditionBadge?.textClass || 'text-gray-700'}`}>
                <span>{product.condition.icon || product.conditionBadge?.icon}</span>
                {product.condition.text || product.conditionBadge?.text || product.condition}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-8">
            <button 
              onClick={() => {
                addToCart(product);
              }}
              className="flex-1 bg-[#3b63f6] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              В кошик
            </button>
            <button 
              onClick={() => toggleFavorite(id!)}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors border ${isFavorite(id!) ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-red-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={isFavorite(id!) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className="mb-8 flex-grow">
            <h3 className="font-bold text-gray-900 mb-2">Опис</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description || "Опис відсутній."}
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl mb-8">
            <p className="text-sm text-gray-500 mb-1">Продавець</p>
            <p className="font-bold text-gray-900 text-lg">{product.sellerName || "Невідомий продавець"}</p>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Переглядів: {product.views || 0}
            </p>
          </div>

          {/* Рейтинг */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">Оцінити товар</h3>
              <div className="text-sm font-medium text-gray-500">
                Середня: <span className="text-gray-900">{currentRating}</span> ({product.reviewsCount || 0} відгуків)
              </div>
            </div>
            
            <div className="flex items-center gap-1" style={{ opacity: ratingLoading ? 0.5 : 1, pointerEvents: ratingLoading ? 'none' : 'auto' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110 group"
                  title={`Оцінити на ${star}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 transition-colors ${
                      star <= Math.round(currentRating) ? "text-yellow-400" : "text-gray-200 group-hover:text-yellow-200"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
