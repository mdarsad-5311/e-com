import { notFound } from "next/navigation";
import { products, Product } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductReviews from "@/components/ProductReviews";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductViewTracker from "@/components/ProductViewTracker";
import RecentlyViewed from "@/components/RecentlyViewed";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return products.map((prod: Product) => ({
    id: prod.id,
  }));
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;

  const product = products.find((p: Product) => p.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p: Product) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="container section">
      <ProductViewTracker product={product} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: product.categoryName, href: `/category/${product.category}` },
          { label: product.title },
        ]}
      />

      <div className="product-detail-layout">
        <ProductGallery
          images={product.galleryImages || [product.image]}
          title={product.title}
          badge={product.badge}
        />
        <ProductInfo product={product} />
      </div>

      <ProductReviews
        reviews={product.reviews}
        rating={product.rating}
        reviewsCount={product.reviewsCount}
      />

      {relatedProducts.length > 0 && (
        <section className="related-products-section section">
          <div className="section-header">
            <div>
              <h2 className="section-title">You may also like</h2>
              <p className="section-subtitle">More from {product.categoryName}</p>
            </div>
          </div>

          <div className="products-grid">
            {relatedProducts.map((relProduct: Product) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
