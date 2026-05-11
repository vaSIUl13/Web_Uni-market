import React from "react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full bg-[#3b63f6] overflow-hidden py-20">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-[1280px] mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Готовий продати або купити?
        </h2>

        <p className="text-lg text-blue-100 mb-10 max-w-2xl">
          Приєднуйся до тисяч студентів, які вже використовують UniMarket
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => navigate('/add-product')}
            className="w-full sm:w-auto bg-white text-[#3b63f6] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-lg"
          >
            Створити оголошення
          </button>

          <button 
            onClick={() => navigate('/catalog')}
            className="w-full sm:w-auto bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
          >
            Переглянути каталог
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
