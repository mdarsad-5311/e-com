import HeroBanner from "@/components/HeroBanner";
import TrendingNow from "@/components/TrendingNow";
import DealOfTheDay from "@/components/DealOfTheDay";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <TrendingNow />
      <DealOfTheDay />
    </main>
  );
}

