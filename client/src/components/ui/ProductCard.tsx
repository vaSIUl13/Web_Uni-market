import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { animateFlyTo } from "../../utils/animations";

interface ProductCardProps {
  id?: string;
  imageUrl: string;
  topBadge?: { text: string; bgClass: string };
  conditionBadge?: {
    text: string;
    icon: string;
    bgClass: string;
    textClass: string;
  };
  category: { text: string; textClass: string; bgClass: string };
  title: string;
  seller?: string;
  sellerName?: string;
  rating?: number;
  reviewsCount?: number;
  price?: string | number;
  oldPrice?: string;
  location?: string;
  timeAgo?: string;
  views?: number;
}

const ProductCard = ({
  id,
  imageUrl,
  topBadge,
  conditionBadge,
  category,
  title,
  seller,
  sellerName,
  rating,
  reviewsCount,
  price,
  oldPrice,
  views,
}: ProductCardProps) => {
  const displaySeller = seller || sellerName || "Невідомий продавець";
  const displayRating = rating ?? 0;
  const displayReviews = reviewsCount ?? 0;

  // Форматуємо ціну
  const formatPrice = (p: string | number | undefined) => {
    if (!p) return null;
    if (typeof p === "number") return `${p} грн`;
    return p;
  };

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleCardClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      animateFlyTo(e, 'fav-icon-desktop', 'burger-menu-btn', 'heart');
      toggleFavorite(id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      animateFlyTo(e, 'cart-icon-desktop', 'burger-menu-btn', 'cart');
      // Reconstruct product object for the cart
      const product = {
        id,
        imageUrl,
        title,
        price,
        category,
        sellerName: displaySeller
      };
      addToCart(product as any);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
          }}
        />

        {topBadge && (
          <div
            className={`absolute top-3 left-3 ${topBadge.bgClass} text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm`}
          >
            {topBadge.text}
          </div>
        )}

        {conditionBadge && (
          <div
            className={`absolute bottom-3 left-3 ${conditionBadge.bgClass} ${conditionBadge.textClass} text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1`}
          >
            <span>{conditionBadge.icon}</span>
            {conditionBadge.text}
          </div>
        )}

        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm ${id && isFavorite(id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill={id && isFavorite(id) ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <span
            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${category.bgClass} ${category.textClass}`}
          >
            {category.text}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 flex-grow line-clamp-2">
          {title}
        </h3>

        {/* Ціна */}
        {formatPrice(price) && (
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-extrabold text-[#3b63f6]">
              {formatPrice(price)}
            </span>
            {oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {oldPrice}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto">
          <p className="text-xs text-gray-500 mb-2">
            Продавець:{" "}
            <span className="font-medium text-gray-700">{displaySeller}</span>
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${
                      i < Math.floor(displayRating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {displayRating > 0 && (
                <>
                  <span className="text-xs font-semibold text-gray-700 ml-1">
                    {displayRating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({displayReviews})
                  </span>
                </>
              )}
            </div>
            {views !== undefined && views > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {views}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="mt-4 w-full bg-[#eff6ff] hover:bg-[#3b63f6] text-[#3b63f6] hover:text-white font-semibold py-2 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            В кошик
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
