import React from "react";

interface ProductCardProps {
  imageUrl: string;
  topBadge?: { text: string; bgClass: string };
  category: { text: string; textClass: string; bgClass: string };
  title: string;
  seller: string;
  rating: number;
  reviewsCount: number;
}

const ProductCard = ({
  imageUrl,
  topBadge,
  category,
  title,
  seller,
  rating,
  reviewsCount,
}: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-pointer flex flex-col h-full">
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {topBadge && (
          <div
            className={`absolute top-3 left-3 ${topBadge.bgClass} text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm`}
          >
            {topBadge.text}
          </div>
        )}

        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
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

        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-4 flex-grow line-clamp-2">
          {title}
        </h3>

        <div className="mt-auto">
          <p className="text-xs text-gray-500 mb-2">
            Продавець:{" "}
            <span className="font-medium text-gray-700">{seller}</span>
          </p>
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700 ml-1">
              {rating}
            </span>
            <span className="text-xs text-gray-400">({reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
