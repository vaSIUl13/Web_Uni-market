import React from "react";

const CatalogSidebar = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <h3 className="font-bold text-gray-900 mb-4">Категорії</h3>
        <ul className="space-y-1.5">
          <li className="bg-blue-50 text-[#3b63f6] rounded-xl px-4 py-2.5 text-sm font-semibold flex justify-between items-center cursor-pointer">
            Всі
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b63f6]"></span>
          </li>
          {["Книги", "Конспекти", "Гаджети", "Послуги"].map((item) => (
            <li
              key={item}
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <h3 className="font-bold text-gray-900 mb-4">Ціна</h3>
        <ul className="space-y-1.5">
          <li className="bg-blue-50 text-[#3b63f6] rounded-xl px-4 py-2.5 text-sm font-semibold flex justify-between items-center cursor-pointer">
            Будь-яка
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b63f6]"></span>
          </li>
          {["До 100 грн", "100–500 грн", "500–2000 грн", "Від 2000 грн"].map(
            (item) => (
              <li
                key={item}
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors"
              >
                {item}
              </li>
            ),
          )}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <h3 className="font-bold text-gray-900 mb-4">Стан товару</h3>
        <div className="space-y-3 pl-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="condition"
              defaultChecked
              className="w-4 h-4 text-[#3b63f6] border-gray-300 focus:ring-[#3b63f6] cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Всі
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="condition"
              className="w-4 h-4 text-[#3b63f6] border-gray-300 focus:ring-[#3b63f6] cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
              ✨ Новий
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="condition"
              className="w-4 h-4 text-[#3b63f6] border-gray-300 focus:ring-[#3b63f6] cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex items-center gap-1">
              ♻️ Б/В
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CatalogSidebar;
