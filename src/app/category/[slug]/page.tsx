import { notFound, redirect } from "next/navigation";
import { categories as fallbackCategories, products as fallbackProducts, Product, Category } from "@/data/products";
import { getCategories, getCategoryBySlug } from "@/lib/categories";
import { getAllProducts, getDeals, getFeaturedProducts } from "@/lib/products";
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
  return fallbackCategories.map((cat: Category) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  if (slug === "support") {
    redirect("/faq");
  }

  // Attempt to fetch category and products from Django API
  const catData = await getCategoryBySlug(slug);
  const category = catData?.category || fallbackCategories.find((c: Category) => c.slug === slug);

  if (!category) {
    notFound();
  }

  let categoryProducts: Product[] = [];

  if (slug === "deals") {
    categoryProducts = await getDeals();
    if (categoryProducts.length === 0) {
      categoryProducts = fallbackProducts.filter(
        (p: Product) =>
          (p.discountPercentage && p.discountPercentage > 0) ||
          p.badge === "SALE" ||
          p.isFeatured ||
          p.isDealOfTheDay
      );
    }
  } else if (slug === "new-arrivals") {
    const featured = await getFeaturedProducts();
    categoryProducts = featured.filter(
      (p: Product) => p.badge === "NEW" || p.isFeatured || p.badge === "HOT"
    );
    if (categoryProducts.length === 0) {
      categoryProducts = featured.slice(0, 12);
    }
    if (categoryProducts.length === 0) {
      categoryProducts = fallbackProducts.slice(0, 12);
    }
  } else {
    if (catData?.products && catData.products.length > 0) {
      categoryProducts = catData.products;
    } else {
      categoryProducts = await getAllProducts({ category: slug });
    }

    if (categoryProducts.length === 0) {
      categoryProducts = fallbackProducts.filter(
        (p: Product) => p.category === slug || (slug === "home-goods" && p.category === "home-living")
      );
    }
    if (categoryProducts.length === 0) {
      categoryProducts = fallbackProducts.filter((p: Product) =>
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


