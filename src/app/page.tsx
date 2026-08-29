import HeroBanner from "@/components/HeroBanner";
import CategoryQuickStrip from "@/components/CategoryQuickStrip";
import TrendingNow from "@/components/TrendingNow";
import DealOfTheDay from "@/components/DealOfTheDay";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestSellers from "@/components/BestSellers";
import PromoBanners from "@/components/PromoBanners";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import VipPerks from "@/components/VipPerks";
import BrandTrust from "@/components/BrandTrust";
import MobileHomePage from "@/components/mobile/MobileHomePage";

export default function Home() {
  return (
    <div className="al-home-page-container">
      {/* Desktop / Tablet Layout - Completely Preserved */}
      <div className="al-desktop-home-view">
        <HeroBanner />
        <CategoryQuickStrip />
        <TrendingNow />
        <DealOfTheDay />
        <FeaturedProducts />
        <BestSellers />
        <PromoBanners />
        <CustomerTestimonials />
        <VipPerks />
        <BrandTrust />
      </div>

      {/* Mobile Shopping App Layout - Redesigned Mobile Experience */}
      <div className="al-mobile-home-view">
        <MobileHomePage />
      </div>
    </div>
  );
}
