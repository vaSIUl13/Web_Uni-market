interface CatalogSidebarProps {
  activeCategory: string;
  activeCondition: string;
  activePrice: string;
  onCategoryChange: (category: string) => void;
  onConditionChange: (condition: string) => void;
  onPriceChange: (price: string) => void;
}

const CatalogSidebar = ({
  activeCategory,
  activeCondition,
  activePrice,
  onCategoryChange,
  onConditionChange,
  onPriceChange,
}: CatalogSidebarProps) => {
  const categories = ["Всі", "Книги", "Конспекти", "Гаджети", "Послуги"];
  const priceRanges = ["Будь-яка", "До 100 грн", "100–500 грн", "500–2000 грн", "Від 2000 грн"];
  const conditions = [
    { value: "Всі", label: "Всі", icon: "" },
    { value: "Новий", label: "Новий", icon: "✨ " },
    { value: "Б/В", label: "Б/В", icon: "♻️ " },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Категорії */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <h3 className="font-bold text-gray-900 mb-4">Категорії</h3>
        <ul className="space-y-1.5">
          {categories.map((item) => (
            <li
              key={item}
              onClick={() => onCategoryChange(item)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors flex justify-between items-center
                ${
                  activeCategory === item
                    ? "bg-blue-50 text-[#3b63f6] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              {item}
              {activeCategory === item && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b63f6]"></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Ціна */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <h3 className="font-bold text-gray-900 mb-4">Ціна</h3>
        <ul className="space-y-1.5">
          {priceRanges.map((item) => (
            <li
              key={item}
              onClick={() => onPriceChange(item)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors flex justify-between items-center
                ${
                  activePrice === item
                    ? "bg-blue-50 text-[#3b63f6] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              {item}
              {activePrice === item && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b63f6]"></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Стан товару */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <h3 className="font-bold text-gray-900 mb-4">Стан товару</h3>
        <div className="space-y-3 pl-1">
          {conditions.map((item) => (
            <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                checked={activeCondition === item.value}
                onChange={() => onConditionChange(item.value)}
                className="w-4 h-4 text-[#3b63f6] border-gray-300 focus:ring-[#3b63f6] cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
                {item.icon}{item.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogSidebar;
