import React, { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../api/api';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  // Refs для авто-фокусу
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Видаляємо всі не-цифри
      const digits = value.replace(/\D/g, '');
      // Додаємо пробіл кожні 4 цифри
      const formatted = digits.replace(/(\d{4})/g, '$1 ').trim();
      setFormData({ ...formData, cardNumber: formatted.slice(0, 19) }); // 16 цифр + 3 пробіли
      
      // Автофокус на дату, якщо введено 16 цифр
      if (digits.length === 16 && expiryRef.current) {
        expiryRef.current.focus();
      }
    } 
    else if (name === 'cardExpiry') {
      // Видаляємо не-цифри
      let digits = value.replace(/\D/g, '');
      
      // Перевірка (користувач просив: перша частина (день) макс 31, друга (місяць) макс 12)
      // Хоча зазвичай на картках MM/YY, зробимо ДД/ММ як просили:
      if (digits.length >= 2) {
        const dd = parseInt(digits.slice(0, 2));
        if (dd > 31) digits = '31' + digits.slice(2);
      }
      if (digits.length >= 4) {
        const mm = parseInt(digits.slice(2, 4));
        if (mm > 12) digits = digits.slice(0, 2) + '12';
      }

      // Додаємо слеш
      let formatted = digits;
      if (digits.length > 2) {
        formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4);
      }
      
      setFormData({ ...formData, cardExpiry: formatted });
      
      // Автофокус на CVV
      if (digits.length === 4 && cvvRef.current) {
        cvvRef.current.focus();
      }
    }
    else if (name === 'cardCvv') {
      const digits = value.replace(/\D/g, '').slice(0, 3); // макс 3 цифри
      setFormData({ ...formData, cardCvv: digits });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl
        })),
        totalAmount: totalPrice,
        deliveryInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        },
        paymentInfo: {
          cardNumber: formData.cardNumber,
        }
      };

      await createOrder(orderData);
      setSuccess(true);
      clearCart();
    } catch (error: any) {
      alert(error.message || "Помилка при оформленні замовлення");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#f8fafc]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-[#1e293b] mb-4 text-center">Дякуємо за покупку!</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом для підтвердження деталей.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-[#3b63f6] hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-colors shadow-sm"
        >
          На головну
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ваш кошик порожній</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Але це ніколи не пізно виправити! Перегляньте наш каталог та знайдіть щось цікаве.</p>
        <button onClick={() => navigate('/catalog')} className="bg-[#eff6ff] hover:bg-[#3b63f6] text-[#3b63f6] hover:text-white font-bold py-3 px-8 rounded-xl transition-colors">
          Перейти до каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 px-4">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-8">Кошик</h1>
        
        <div className="flex flex-col gap-8">
          {/* Список товарів */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 md:p-6 flex flex-col gap-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <Link to={`/product/${item.product.id}`} className="w-full sm:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                    </Link>
                    
                    <div className="flex-1 flex flex-col justify-between w-full h-full">
                      <div className="flex justify-between items-start gap-2">
                        <Link to={`/product/${item.product.id}`} className="font-bold text-base md:text-lg text-[#1e293b] hover:text-[#3b63f6] transition-colors line-clamp-2">
                          {item.product.title}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.product.id!)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="hidden sm:inline">Видалити</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 w-full">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                          <button 
                            onClick={() => updateQuantity(item.product.id!, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all text-lg leading-none"
                          >
                            -
                          </button>
                          <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id!, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all text-lg leading-none"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-extrabold text-lg md:text-xl text-[#3b63f6]">
                          {Number(item.product.price) * item.quantity} грн
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Секція оформлення (тепер знизу на всю ширину) */}
          <div className="w-full">
            {!isCheckingOut ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-4">Підсумки замовлення</h3>
                
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-100 pt-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2 text-sm md:text-base text-gray-600">
                      <span>Товари ({cart.reduce((s, i) => s + i.quantity, 0)} шт.)</span>
                      <span className="font-medium">{totalPrice} грн</span>
                    </div>
                    <div className="flex justify-between items-center text-sm md:text-base text-gray-600">
                      <span>Доставка</span>
                      <span className="text-green-500 font-medium">Безкоштовно</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-start sm:items-end sm:pl-8 sm:border-l border-gray-100">
                    <span className="font-bold text-[#1e293b] text-sm md:text-base mb-1">До сплати:</span>
                    <span className="font-extrabold text-2xl md:text-3xl text-[#3b63f6] mb-4">{totalPrice} грн</span>
                    <button 
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full sm:w-auto px-8 bg-[#3b63f6] hover:bg-blue-700 text-white font-bold py-3 md:py-4 rounded-xl transition-colors shadow-sm"
                    >
                      Перейти до оформлення
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <button onClick={() => setIsCheckingOut(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1e293b]">Оформлення замовлення</h3>
                </div>
                
                <form onSubmit={handleCheckoutSubmit} className="flex flex-col md:flex-row gap-8">
                  {/* Дані отримувача */}
                  <div className="flex-1 space-y-4">
                    <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-2">Отримувач</h4>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="ПІБ" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-gray-50 focus:bg-white" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Телефон" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-gray-50 focus:bg-white" />
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Адреса доставки (напр. Гуртожиток 1, кімн 102)" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  
                  {/* Дані картки */}
                  <div className="flex-1 bg-gray-50 p-5 md:p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-2">Оплата карткою</h4>
                      <input 
                        type="text" 
                        name="cardNumber" 
                        value={formData.cardNumber} 
                        onChange={handleInputChange} 
                        placeholder="Номер картки (16 цифр)" 
                        required 
                        maxLength={19} 
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-white" 
                      />
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          name="cardExpiry" 
                          ref={expiryRef}
                          value={formData.cardExpiry} 
                          onChange={handleInputChange} 
                          placeholder="ДД/ММ" 
                          required 
                          maxLength={5} 
                          className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-white" 
                        />
                        <input 
                          type="text" 
                          name="cardCvv" 
                          ref={cvvRef}
                          value={formData.cardCvv} 
                          onChange={handleInputChange} 
                          placeholder="CVV" 
                          required 
                          maxLength={3} 
                          className="w-1/2 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-white" 
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-[#1e293b]">Разом до сплати:</span>
                        <span className="font-extrabold text-2xl text-[#3b63f6]">{totalPrice} грн</span>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-70"
                      >
                        {loading ? "Обробка..." : "Оплатити та купити"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
