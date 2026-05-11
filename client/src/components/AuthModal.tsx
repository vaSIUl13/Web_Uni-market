import React, { useState, useEffect } from 'react';
import { signInWithGoogle, registerWithEmail, loginWithEmail } from '../firebase/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) throw new Error("Введіть ім'я");
        await registerWithEmail(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Помилка авторизації. Перевірте дані.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const user = await signInWithGoogle();
    if (user) onClose();
    else setError("Помилка входу через Google");
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pb-6 bg-[#eff6ff] text-center border-b border-blue-100">
          <div className="w-12 h-12 bg-[#3b63f6] rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b]">
            {isLoginMode ? "З поверненням!" : "Створити акаунт"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLoginMode ? "Увійдіть до свого облікового запису" : "Приєднуйтесь до студентського маркетплейсу"}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я та прізвище</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Іван Іванов"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (студентський або особистий)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-gray-50 focus:bg-white"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#3b63f6] focus:ring-1 focus:ring-[#3b63f6] transition-all bg-gray-50 focus:bg-white"
                placeholder="Мінімум 6 символів"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#3b63f6] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 mt-2"
            >
              {loading ? "Зачекайте..." : isLoginMode ? "Увійти" : "Зареєструватися"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="text-sm text-gray-400 font-medium">АБО</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Продовжити з Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLoginMode ? "Ще не маєте акаунту?" : "Вже маєте акаунт?"}{" "}
            <button 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-[#3b63f6] font-semibold hover:underline"
            >
              {isLoginMode ? "Зареєструватися" : "Увійти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
