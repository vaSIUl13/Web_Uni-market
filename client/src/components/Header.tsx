import React, { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault(); // Зупиняємо стандартний різкий стрибок браузера

    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({ top: y, behavior: "smooth" });
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer z-50">
          <div className="w-10 h-10 bg-[#3b63f6] rounded-xl flex items-center justify-center text-white shadow-sm">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
            <span className="text-[#3b63f6]">Uni</span>Market
          </h1>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          <a
            href="#"
            className="bg-[#eff6ff] text-[#3b63f6] px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            Головна
          </a>
          <a
            href="#"
            className="text-gray-600 hover:bg-gray-50 hover:text-[#3b63f6] px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            Каталог
          </a>
          <a
            href="#categories"
            onClick={(e) => handleScroll(e, "categories")}
            className="text-gray-600 hover:bg-gray-50 hover:text-[#3b63f6] px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            Категорії
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "about")}
            className="text-gray-600 hover:bg-gray-50 hover:text-[#3b63f6] px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            Про проєкт
          </a>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button className="text-gray-500 hover:text-[#3b63f6] p-2 transition-colors mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          <button className="flex items-center gap-2 border border-[#3b63f6] text-[#3b63f6] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#eff6ff] transition-colors">
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Увійти
          </button>
          <button className="flex items-center gap-2 bg-[#3b63f6] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Додати
          </button>
        </div>

        <button
          className="lg:hidden p-2 text-gray-600 hover:text-[#3b63f6] transition-colors z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`lg:hidden fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <nav className="flex flex-col gap-4 text-center text-lg font-medium">
          <a href="#" className="bg-[#eff6ff] text-[#3b63f6] py-3 rounded-2xl">
            Головна
          </a>
          <a href="#" className="py-3 text-gray-700 hover:text-[#3b63f6]">
            Каталог
          </a>
          <a
            href="#categories"
            onClick={(e) => handleScroll(e, "categories")}
            className="py-3 text-gray-700 hover:text-[#3b63f6] cursor-pointer"
          >
            Категорії
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "about")}
            className="py-3 text-gray-700 hover:text-[#3b63f6] cursor-pointer"
          >
            Про проєкт
          </a>
        </nav>

        <div className="mt-auto mb-10 flex flex-col gap-3">
          <button className="w-full flex justify-center items-center gap-2 border border-[#3b63f6] text-[#3b63f6] py-3.5 rounded-2xl font-semibold">
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Увійти
          </button>
          <button className="w-full flex justify-center items-center gap-2 bg-[#3b63f6] text-white py-3.5 rounded-2xl font-semibold">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Додати оголошення
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
