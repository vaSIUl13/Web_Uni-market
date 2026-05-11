import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../firebase/productsService';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryText, setCategoryText] = useState('Книги');
  const [conditionText, setConditionText] = useState('Новий');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { text: "Книги", bgClass: "bg-blue-50", textClass: "text-blue-600" },
    { text: "Конспекти", bgClass: "bg-purple-50", textClass: "text-purple-600" },
    { text: "Гаджети", bgClass: "bg-cyan-50", textClass: "text-cyan-600" },
    { text: "Послуги", bgClass: "bg-yellow-50", textClass: "text-yellow-600" },
  ];

  const conditions = [
    { text: "Новий", icon: "✨", bgClass: "bg-green-50", textClass: "text-green-600" },
    { text: "Б/В", icon: "♻️", bgClass: "bg-gray-50", textClass: "text-gray-600" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Додайте фото товару!");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const selectedCategory = categories.find(c => c.text === categoryText);
      const selectedCondition = conditions.find(c => c.text === conditionText);

      await createProduct({
        title,
        price: Number(price),
        description,
        category: selectedCategory,
        condition: selectedCondition,
      }, imageFile);

      navigate('/catalog');
    } catch (err: any) {
      setError(err.message || 'Помилка створення товару');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-6">Додати оголошення</h1>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Назва товару</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6]"
              placeholder="Наприклад: Збірник задач з вищої математики"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ціна (грн)</label>
            <input 
              type="number" 
              required
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6]"
              placeholder="Наприклад: 150"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Категорія</label>
            <select 
              value={categoryText}
              onChange={(e) => setCategoryText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] bg-white"
            >
              {categories.map(c => <option key={c.text} value={c.text}>{c.text}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Стан</label>
            <select 
              value={conditionText}
              onChange={(e) => setConditionText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] bg-white"
            >
              {conditions.map(c => <option key={c.text} value={c.text}>{c.text}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Опис (необов'язково)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] min-h-[120px]"
              placeholder="Детальний опис вашого товару..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Фотографія</label>
            <input 
              type="file" 
              accept="image/*"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#3b63f6] hover:file:bg-blue-100"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#3b63f6] text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? "Публікація..." : "Опублікувати оголошення"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
