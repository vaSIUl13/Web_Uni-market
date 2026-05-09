import React from "react";
import CatalogSidebar from "../components/CatalogSidebar";
import ProductCard from "../components/ui/ProductCard";

const CatalogPage = () => {
  const catalogProducts = [
    {
      id: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80",
      topBadge: { text: "Хіт", bgClass: "bg-amber-500" },
      conditionBadge: {
        text: "Новий",
        icon: "✨",
        bgClass: "bg-white",
        textClass: "text-green-600",
      },
      category: {
        text: "Конспекти",
        textClass: "text-purple-600",
        bgClass: "bg-purple-50",
      },
      title: "Конспект лекцій з органічної хімії (Повний курс)",
      seller: "Дмитро Петренко",
      rating: 4.9,
      reviewsCount: 38,
      location: "Київ",
      timeAgo: "5 годин тому",
      price: "80 грн",
    },
    {
      id: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      topBadge: { text: "Популярне", bgClass: "bg-[#3b63f6]" },
      conditionBadge: {
        text: "Б/В",
        icon: "♻️",
        bgClass: "bg-white",
        textClass: "text-gray-600",
      },
      category: {
        text: "Книги",
        textClass: "text-[#3b63f6]",
        bgClass: "bg-blue-50",
      },
      title: "Збірник задач з вищої математики",
      seller: "Олена Коваль",
      rating: 4.8,
      reviewsCount: 24,
      location: "Львів",
      timeAgo: "2 години тому",
      price: "120 грн",
      oldPrice: "200 грн",
    },
    {
      id: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      conditionBadge: {
        text: "Новий",
        icon: "✨",
        bgClass: "bg-white",
        textClass: "text-green-600",
      },
      category: {
        text: "Гаджети",
        textClass: "text-cyan-600",
        bgClass: "bg-cyan-50",
      },
      title: "Настільна лампа для навчання LED",
      seller: "Максим Сидоренко",
      rating: 5.0,
      reviewsCount: 12,
      location: "Харків",
      timeAgo: "1 день тому",
      price: "450 грн",
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6">
            <span>🛒</span> Каталог
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e293b] mb-2 tracking-tight">
            Каталог оголошень
          </h1>
          <p className="text-gray-500 mb-8">8 оголошень знайдено</p>

          <div className="max-w-2xl flex items-center gap-3">
            <div className="flex-1 bg-white border border-gray-200 p-2 rounded-2xl shadow-sm flex items-center focus-within:border-[#3b63f6] focus-within:ring-1 focus-within:ring-[#3b63f6] transition-all">
              <div className="pl-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Пошук за назвою, категорією..."
                className="w-full px-3 py-2 text-sm focus:outline-none bg-transparent"
              />
            </div>
            <button className="bg-[#3b63f6] text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
              Шукати
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <CatalogSidebar />
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {["Всі", "Книги", "Конспекти", "Гаджети", "Послуги"].map(
                (tab, i) => (
                  <button
                    key={tab}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors border
                    ${i === 0 ? "bg-[#3b63f6] text-white border-[#3b63f6] shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <div className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">Новіші</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {catalogProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
