import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, subscribeToAuthChanges } from "../firebase/authService";
import type { User } from "firebase/auth";
import AuthModal from "./AuthModal";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { favoriteIds } = useFavorites();

  // Підписка на авторизацію
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // Якщо ми НЕ на головній сторінці - спочатку переходимо туди
    if (location.pathname !== "/") {
      navigate("/");
      // Даємо React мілісекунду на рендер головної сторінки, потім скролимо
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    } else {
      // Якщо вже на головній - просто скролимо
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const handleAddProduct = () => {
    if (user) {
      navigate('/add-product');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer z-50">
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
        </Link>

        <nav className="hidden lg:flex items-center gap-2">
          <Link
            to="/"
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              location.pathname === "/"
                ? "bg-[#eff6ff] text-[#3b63f6]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#3b63f6]"
            }`}
          >
            Головна
          </Link>
          <Link
            to="/catalog"
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              location.pathname === "/catalog"
                ? "bg-[#eff6ff] text-[#3b63f6]"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#3b63f6]"
            }`}
          >
            Каталог
          </Link>
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
          <Link to="/favorites" className="text-gray-500 hover:text-red-500 p-2 transition-colors relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favoriteIds.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="text-gray-500 hover:text-[#3b63f6] p-2 transition-colors mr-2 relative">
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
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#3b63f6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
          /* Блок, який з'явиться ПІСЛЯ входу */
            <div className="flex items-center gap-4 pr-2">
              <Link to="/orders" className="text-sm font-semibold text-gray-700 hover:text-[#3b63f6] transition-colors">
                Мої замовлення
              </Link>
              <div className="text-right">
                <p className="text-xs font-bold text-[#1e293b] leading-tight">
                  {user.displayName}
                </p>
                <button 
                  onClick={logout} 
                  className="text-[10px] text-red-500 hover:underline font-medium uppercase tracking-tighter"
                >
                  Вийти
                </button>
              </div>
              <img 
                src={user.photoURL || ""} 
                alt="user" 
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-gray-100 shadow-sm" 
              />
            </div>
          ) : (
            /* Твоя оригінальна кнопка, до якої ми просто додали onClick */
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 border border-[#3b63f6] text-[#3b63f6] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#eff6ff] transition-colors"
            >
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
          )}
          
          
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-[#3b63f6] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
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
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-3 rounded-2xl ${
              location.pathname === "/" 
                ? "bg-[#eff6ff] text-[#3b63f6]" 
                : "text-gray-700 hover:text-[#3b63f6]"
            }`}
          >
            Головна
          </Link>
          <Link 
            to="/catalog" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`py-3 rounded-2xl ${
              location.pathname === "/catalog" 
                ? "bg-[#eff6ff] text-[#3b63f6]" 
                : "text-gray-700 hover:text-[#3b63f6]"
            }`}
          >
            Каталог
          </Link>
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
          
          <div className="w-full h-px bg-gray-100 my-2"></div>
          
          <Link 
            to="/cart" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-3 text-gray-700 hover:text-[#3b63f6] cursor-pointer"
          >
            <span>Кошик</span>
            {totalItems > 0 && (
              <span className="w-5 h-5 bg-[#3b63f6] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          <Link 
            to="/favorites" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-3 text-gray-700 hover:text-red-500 cursor-pointer"
          >
            <span>Обрані</span>
            {favoriteIds.length > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </Link>

          {user && (
            <Link 
              to="/orders" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 text-gray-700 hover:text-[#3b63f6] cursor-pointer"
            >
              Мої замовлення
            </Link>
          )}
        </nav>

        <div className="mt-auto mb-10 flex flex-col gap-3">
          {!user && (
            <button 
              onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
              className="w-full flex justify-center items-center gap-2 border border-[#3b63f6] text-[#3b63f6] py-3.5 rounded-2xl font-semibold"
            >
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
          )}
          <button 
            onClick={() => { setIsMobileMenuOpen(false); handleAddProduct(); }}
            className="w-full flex justify-center items-center gap-2 bg-[#3b63f6] text-white py-3.5 rounded-2xl font-semibold"
          >
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
    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
