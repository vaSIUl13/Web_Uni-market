// client/src/pages/Home.tsx
import Hero from '../components/Hero';
import StatsBanner from '../components/StatsBanner';
import Categories from '../components/Categories';
import PopularAds from '../components/PopularAds';
import CallToAction from '../components/CallToAction';

const Home = () => {
  return (
    <>
      <Hero />
      <StatsBanner />
      <Categories />
      <PopularAds />
      <CallToAction />
    </>
  );
};

export default Home;