import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Headphones, Shirt, Home, Watch } from "lucide-react";
import { categories, products, Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categoryIconMap = {
  Headphones: Headphones,
  Shirt: Shirt,
  Home: Home,
  Watch: Watch,
};

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
  const IconComponent = categoryIconMap[category.icon] || Headphones;

  return (
    <div className="container section">

      {/* Category Hero Banner */}
      <div className="category-hero glass-card">
        <div
          className="category-hero-bg"
          style={{ backgroundImage: `url(${category.image})` }}
        />
        <div className="category-hero-overlay" />

        <div className="category-hero-content">
          <Link href="/products" className="back-link">
            <ArrowLeft size={16} /> Back to all categories
          </Link>

          <div className="category-header-row">
            <div className="category-icon-box">
              <IconComponent size={28} />
            </div>
            <div>
              <span className="category-badge">{categoryProducts.length} Items Available</span>
              <h1 className="category-title">{category.name}</h1>
              <p className="category-description">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="section-header" style={{ marginTop: "3rem" }}>
        <div>
          <h2 className="section-title">{category.name} Collection</h2>
          <p className="section-subtitle">
            Browse our handpicked {category.name.toLowerCase()} selection.
          </p>
        </div>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="products-grid-4">
          {categoryProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-category glass-card">
          <p>No products currently available in this category.</p>
          <Link href="/products" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Explore All Products
          </Link>
        </div>
      )}
    </div>
  );
}
