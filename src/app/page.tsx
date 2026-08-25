import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import DealOfTheDay from "@/components/DealOfTheDay";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <Categories />
      <DealOfTheDay />
      <FeaturedProducts />
    </>
  );
}

