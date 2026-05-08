// client/src/App.tsx
import Header from './components/Header';
import Hero from './components/Hero';
import StatsBanner from './components/StatsBanner';
import Categories from './components/Categories';
import PopularAds from './components/PopularAds';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        <StatsBanner />
        <Categories />
        <PopularAds />
        <CallToAction />
        <Footer />
      </main>

    </div>
  );
}

export default App;