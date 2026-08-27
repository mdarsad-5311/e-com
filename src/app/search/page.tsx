import { Suspense } from "react";
import SearchPage from "@/components/SearchPage";

export const metadata = {
  title: "Search | Al-Umaima",
  description: "Search for products on Al-Umaima — electronics, fashion, home goods and more.",
};

export default function SearchRoute() {
  return (
    <Suspense fallback={
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        Loading search...
      </div>
    }>
      <SearchPage />
    </Suspense>
  );
}
