import React, { useState, useEffect } from 'react';
import { fetchMyOrders } from '../api/api';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Помилка завантаження замовлень", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#3b63f6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 px-4">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-8">Мої замовлення</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-300 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Ви ще нічого не замовляли</h2>
            <p className="text-gray-500 mb-6 max-w-sm">Ваша історія замовлень порожня. Саме час щось придбати!</p>
            <Link to="/catalog" className="bg-[#eff6ff] text-[#3b63f6] font-bold py-3 px-8 rounded-xl hover:bg-[#3b63f6] hover:text-white transition-colors">
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Замовлення №{order.id.slice(-6).toUpperCase()}</span>
                    <div className="text-sm font-bold text-gray-900 mt-1">
                      {new Date(order.createdAt?._seconds * 1000 || Date.now()).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-yellow-100 text-yellow-700 font-bold text-xs rounded-lg">
                    {order.status || "В обробці"}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <Link to={`/product/${item.productId}`} className="font-bold text-gray-900 hover:text-[#3b63f6] transition-colors line-clamp-1">
                            {item.title}
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.price} грн &times; {item.quantity} шт
                          </div>
                        </div>
                        <div className="font-extrabold text-[#3b63f6]">
                          {Number(item.price) * item.quantity} грн
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-gray-500">Загальна сума:</span>
                  <span className="font-extrabold text-xl text-[#1e293b]">{order.totalAmount} грн</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
