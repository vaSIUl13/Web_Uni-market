import React from "react";
import StatItem from "./ui/StatItem";
import FloatingBadge from "./ui/FloatingBadge";
import WidgetCard from "./ui/WidgetCard";

const Hero = () => {
  return (
    <section className="relative w-full bg-[#f8fafc] overflow-hidden pt-12 pb-20">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#1e293b] leading-[1.1] tracking-tight">
              Студентський <br /> маркетплейс для <br />
              <span className="text-[#3b63f6]">навчання</span> та <br />
              повсякденних <br /> потреб
            </h1>
            <p className="text-lg text-gray-500 max-w-md leading-relaxed">
              UniMarket — це зручна платформа, де студенти можуть купувати та
              продавати навчальні матеріали, гаджети, конспекти та послуги. Все
              для вашого університетського життя в одному місці.
            </p>
          </div>

          <div className="bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center max-w-lg border border-gray-100">
            <div className="pl-4 text-gray-400">
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
              placeholder="Пошук товарів, конспектів, послуг..."
              className="w-full px-3 py-3 text-sm focus:outline-none bg-transparent"
            />
            <button className="bg-[#3b63f6] text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Шукати
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <StatItem
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              }
              text="2 400+ товарів"
            />
            <StatItem
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
              text="850+ студентів"
            />
            <StatItem
              icon={
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
              text="4.9 рейтинг"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button className="bg-[#3b63f6] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
              Переглянути каталог
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
            <button className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
              Додати оголошення
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative h-[500px]">
          <FloatingBadge
            className="absolute top-10 left-10 z-20"
            icon={<span className="text-xl">🎓</span>}
            title="Лише для студентів"
            subtitle="Верифіковані оголошення"
          />

          <WidgetCard
            className="absolute top-32 right-0 w-72 z-10"
            imageUrl="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80"
            title="Навчальні матеріали"
            rating="4.8"
            price="від 50 грн"
            badgeText="Хіт"
            badgeColor="bg-[#3b63f6]"
          />

          <WidgetCard
            className="absolute bottom-20 left-16 w-72 z-30"
            imageUrl="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=150&q=80"
            title="Гаджети"
            rating="4.9"
            price="від 200 грн"
            badgeText="Нове"
            badgeColor="bg-green-500"
          />

          <FloatingBadge
            className="absolute -bottom-4 right-12 z-20"
            dotColor="bg-green-500"
            title="+12 нових оголошень сьогодні"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
