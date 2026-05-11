import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// Ледачі імпорти для розділення коду (Code Splitting)
const Home = lazy(() => import("./pages/Home"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const AddProductPage = lazy(() => import("./pages/AddProductPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#3b63f6] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                  <Route path="/add-product" element={<AddProductPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;
