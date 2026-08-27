import { notFound } from "next/navigation";
import { categories, products, Product, Category } from "@/data/products";
import CategoryView from "@/components/CategoryView";
import FashionView from "@/components/FashionView";
import HomeGoodsView from "@/components/HomeGoodsView";
import ElectronicsView from "@/components/ElectronicsView";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return categories.map((cat: Category) => ({
    slug: cat.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = categories.find((c: Category) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p: Product) => p.category === slug);

  if (slug === "electronics") {
    return <ElectronicsView products={categoryProducts} />;
  }

  if (slug === "fashion") {
    return <FashionView products={categoryProducts} />;
  }

  if (slug === "home-goods" || slug === "home-living") {
    return <HomeGoodsView />;
  }

  return <CategoryView category={category} initialProducts={categoryProducts} />;
}

