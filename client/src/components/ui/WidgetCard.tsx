import React from 'react';

interface WidgetCardProps {
  imageUrl: string;
  title: string;
  rating: string;
  price: string;
  badgeText: string;
  badgeColor: string;
  className?: string;
}

const WidgetCard = ({ imageUrl, title, rating, price, badgeText, badgeColor, className }: WidgetCardProps) => {
  return (
    <div className={`bg-white shadow-[0_12px_40px_rgb(0,0,0,0.08)] rounded-2xl p-3 pr-6 flex items-center gap-4 ${className || ''}`}>
      <img src={imageUrl} alt={title} className="w-16 h-16 rounded-xl object-cover" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${badgeColor}`}>
            {badgeText}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1">
          <span className="text-yellow-400">★</span> {rating}
        </div>
        <p className="text-sm font-bold text-[#3b63f6]">{price}</p>
      </div>
    </div>
  );
};

export default WidgetCard;