import React from 'react';
import CategoryCard from './ui/CategoryCard';

const Categories = () => {
  return (
    <section id="categories" className="w-full bg-white py-20">
      <div className=" mx-auto px-4">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            {/* Маленький бейджик "Категорії" */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4">
              <span>🗂️</span> Категорії
            </div>
            
            <h2 className="text-4xl font-extrabold text-[#1e293b] mb-4 tracking-tight">
              Знайдіть те, що потрібно
            </h2>
            <p className="text-lg text-gray-500">
              Оберіть категорію та переглядайте тисячі оголошень від студентів
            </p>
          </div>
          
          {/* Посилання "Всі категорії" */}
          <a href="#" className="flex items-center gap-1 text-[#3b63f6] font-semibold hover:text-blue-800 transition-colors">
            Всі категорії
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Сітка карток (4 в ряд на великих екранах) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard 
            title="Книги"
            description="Підручники, художня та наукова література"
            count="840 оголошень"
            iconEmoji="📚"
            themeColor="blue"
          />
          <CategoryCard 
            title="Конспекти"
            description="Нотатки, шпаргалки та навчальні матеріали"
            count="520 оголошень"
            iconEmoji="📝"
            themeColor="purple"
          />
          <CategoryCard 
            title="Гаджети"
            description="Техніка, аксесуари та електроніка"
            count="390 оголошень"
            iconEmoji="💻"
            themeColor="cyan"
          />
          <CategoryCard 
            title="Послуги"
            description="Репетиторство, дизайн, переклади"
            count="650 оголошень"
            iconEmoji="🤝"
            themeColor="green"
          />
        </div>

      </div>
    </section>
  );
};

export default Categories;