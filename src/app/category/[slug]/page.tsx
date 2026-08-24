import { notFound } from "next/navigation";
import { categories, products, Product, Category } from "@/data/products";
import CategoryView from "@/components/CategoryView";

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

  return <CategoryView category={category} initialProducts={categoryProducts} />;
}
