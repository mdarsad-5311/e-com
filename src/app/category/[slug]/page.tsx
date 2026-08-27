import { notFound, redirect } from "next/navigation";
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

  if (slug === "support") {
    redirect("/faq");
  }

  const category = categories.find((c: Category) => c.slug === slug);

  if (!category) {
    notFound();
  }

  let categoryProducts: Product[] = [];

  if (slug === "deals") {
    categoryProducts = products.filter(
      (p: Product) =>
        (p.discountPercentage && p.discountPercentage > 0) ||
        p.badge === "SALE" ||
        p.isFeatured ||
        p.isDealOfTheDay
    );
  } else if (slug === "new-arrivals") {
    categoryProducts = products.filter(
      (p: Product) => p.badge === "NEW" || p.isFeatured || p.badge === "HOT"
    );
    if (categoryProducts.length === 0) {
      categoryProducts = products.slice(0, 12);
    }
  } else {
    categoryProducts = products.filter(
      (p: Product) => p.category === slug || (slug === "home-goods" && p.category === "home-living")
    );
    if (categoryProducts.length === 0) {
      categoryProducts = products.filter((p: Product) =>
        p.categoryName.toLowerCase().includes(slug.replace(/-/g, " "))
      );
    }
  }

  if (slug === "electronics") {
    return <ElectronicsView products={categoryProducts} />;
  }

  if (slug === "fashion") {
    return <FashionView products={categoryProducts} />;
  }

  if (slug === "home-goods" || slug === "home-living") {
    return <HomeGoodsView products={categoryProducts} />;
  }

  return <CategoryView category={category} initialProducts={categoryProducts} />;
}


