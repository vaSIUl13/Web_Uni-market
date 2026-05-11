import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ui/ProductCard";
import { getProducts } from "../firebase/productsService";

const PopularAds = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Всі");

  const filters = ["Всі", "Книги", "Конспекти", "Гаджети", "Послуги"];

  // Fallback моки на випадок якщо бекенд недоступний
  const mockProducts = [
    {
      id: "mock-1",
      imageUrl:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      topBadge: { text: "Популярне", bgClass: "bg-blue-600" },
      category: {
        text: "Книги",
        textClass: "text-blue-600",
        bgClass: "bg-blue-50",
      },
      title: "Збірник задач з вищої математики",
      sellerName: "Олена Коваль",
      rating: 4.8,
      reviewsCount: 24,
      price: 120,
    },
    {
      id: "mock-2",
      imageUrl:
        "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=600&q=80",
      topBadge: { text: "Топ", bgClass: "bg-green-500" },
      category: {
        text: "Конспекти",
        textClass: "text-purple-600",
        bgClass: "bg-purple-50",
      },
      title: "Конспект лекцій з органічної хімії",
      sellerName: "Дмитро Петренко",
      rating: 4.9,
      reviewsCount: 38,
      price: 80,
    },
    {
      id: "mock-3",
      imageUrl:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      topBadge: { text: "Знижка", bgClass: "bg-amber-500" },
      category: {
        text: "Гаджети",
        textClass: "text-cyan-600",
        bgClass: "bg-cyan-50",
      },
      title: "Бездротові навушники Sony WH-1000XM4",
      sellerName: "Марія Сидоренко",
      rating: 5.0,
      reviewsCount: 12,
      price: 3500,
    },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const category = activeFilter === "Всі" ? undefined : activeFilter;
        const result = await getProducts(category, undefined, 6);
        // Якщо є реальні товари — показуємо їх, якщо ні — моки
        if (result.length > 0) {
          setProducts(result);
        } else {
          const filteredMocks = activeFilter === "Всі" 
            ? mockProducts 
            : mockProducts.filter(m => m.category.text === activeFilter);
          setProducts(filteredMocks);
        }
      } catch (error) {
        console.error("Помилка завантаження популярних:", error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeFilter]);

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold mb-4 border border-yellow-100">
              <span>⭐</span> Рекомендовані
            </div>

            <h2 className="text-4xl font-extrabold text-[#1e293b] mb-3 tracking-tight">
              Популярні оголошення
            </h2>
            <p className="text-gray-500">
              Найкращі пропозиції від студентів українських університетів
            </p>
          </div>

          <Link
            to="/catalog"
            className="flex items-center gap-1 text-[#3b63f6] font-semibold hover:text-blue-800 transition-colors"
          >
            Всі оголошення
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-colors border
                ${
                  activeFilter === filter
                    ? "bg-[#3b63f6] text-white border-[#3b63f6] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#3b63f6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Products grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                topBadge={product.topBadge}
                conditionBadge={product.conditionBadge || product.condition}
                category={product.category}
                title={product.title}
                seller={product.sellerName}
                price={product.price}
                views={product.views}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularAds;
