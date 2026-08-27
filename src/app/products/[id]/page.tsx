import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { products, Product } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductViewTracker from "@/components/ProductViewTracker";

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
  const product = products.find((p: Product) => p.id === id) || products[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="al-product-detail-page">
      <div className="container">
        <ProductViewTracker product={product} />

        {/* Clean Breadcrumb Matching Attachment 1 */}
        <div className="al-detail-breadcrumbs">
          <Link href="/category/electronics" className="al-crumb-link">Electronics</Link>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <Link href="/category/electronics" className="al-crumb-link">Audio</Link>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <span className="al-crumb-current">{product.title}</span>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="al-product-detail-grid">
          {/* Left Column: Big Product Image Showcase */}
          <div className="al-detail-media-column">
            <ProductGallery
              images={product.galleryImages || [product.image]}
              title={product.title}
              product={product}
            />
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="al-detail-info-column">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
