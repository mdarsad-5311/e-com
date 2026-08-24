import HeroBanner from "@/components/HeroBanner";
import DealOfTheDay from "@/components/DealOfTheDay";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanners from "@/components/PromoBanners";
import BestSellers from "@/components/BestSellers";
import VipPerks from "@/components/VipPerks";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import BrandTrust from "@/components/BrandTrust";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <BrandTrust />
      <DealOfTheDay />
      <Categories />
      <PromoBanners />
      <FeaturedProducts />
      <BestSellers />
      <RecentlyViewed />
      <VipPerks />
      <CustomerTestimonials />
    </>
  );
}

