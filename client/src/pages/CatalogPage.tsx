import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CatalogSidebar from "../components/CatalogSidebar";
import ProductCard from "../components/ui/ProductCard";
import { getProducts, searchProducts } from "../firebase/productsService";

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlSearchQuery = searchParams.get("search") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Всі");
  const [activeCondition, setActiveCondition] = useState("Всі");
  const [activePrice, setActivePrice] = useState("Будь-яка");
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [searchInput, setSearchInput] = useState(urlSearchQuery);

  const categories = ["Всі", "Книги", "Конспекти", "Гаджети", "Послуги"];

  // Завантаження товарів
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (searchQuery.trim()) {
        result = await searchProducts(searchQuery);
      } else {
        result = await getProducts(activeCategory, activeCondition);
      }
      setProducts(result);
    } catch (error) {
      console.error("Помилка завантаження:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeCondition, searchQuery]);

  // Синхронізуємо зі зміною URL (якщо перейшли з іншої сторінки)
  useEffect(() => {
    if (urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery);
      setSearchInput(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setSearchParams(searchInput ? { search: searchInput } : {});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
    setSearchInput("");
  };

  const handleConditionChange = (condition: string) => {
    setActiveCondition(condition);
  };

  const handlePriceChange = (price: string) => {
    setActivePrice(price);
  };

  const filteredProducts = products.filter(p => {
    if (!p.price) return true;
    if (activePrice === "Будь-яка") return true;
    if (activePrice === "До 100 грн") return p.price <= 100;
    if (activePrice === "100–500 грн") return p.price > 100 && p.price <= 500;
    if (activePrice === "500–2000 грн") return p.price > 500 && p.price <= 2000;
    if (activePrice === "Від 2000 грн") return p.price > 2000;
    return true;
  });

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
          <p className="text-gray-500 mb-8">
            {loading
              ? "Завантаження..."
              : `${filteredProducts.length} оголошень знайдено`}
          </p>

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#3b63f6] text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              Шукати
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <CatalogSidebar
            activeCategory={activeCategory}
            activeCondition={activeCondition}
            activePrice={activePrice}
            onCategoryChange={handleCategoryChange}
            onConditionChange={handleConditionChange}
            onPriceChange={handlePriceChange}
          />
        </aside>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleCategoryChange(tab)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors border
                    ${
                      activeCategory === tab
                        ? "bg-[#3b63f6] text-white border-[#3b63f6] shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {tab}
                </button>
              ))}
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

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-[#3b63f6] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm">Завантаження товарів...</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Товарів не знайдено</h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Спробуйте змінити фільтри або пошуковий запит
              </p>
            </div>
          )}

          {/* Products grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard
                    id={product.id}
                    imageUrl={product.imageUrl}
                    topBadge={product.topBadge}
                    conditionBadge={product.conditionBadge || product.condition}
                    category={product.category}
                    title={product.title}
                    seller={product.sellerName}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    views={product.views}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
