import { notFound } from "next/navigation";
import { products, Product } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  const product = products.find((p: Product) => p.id === id);

  if (!product) {
    notFound();
  }

  // Breadcrumbs matching reference: Home > Electronics & Audio > Headphones > Aura Noise-Canceling Wireless Headphones
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: product.categoryName || "Electronics & Audio", href: `/category/${product.category}` },
    { label: product.category === "electronics" ? "Headphones" : product.categoryName, href: `/category/${product.category}` },
    { label: product.title },
  ];

  return (
    <div className="al-product-detail-page">
      <div className="container">
        <ProductViewTracker product={product} />
        
        {/* Breadcrumb Navigation */}
        <div className="al-detail-breadcrumb-wrap">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* 3-Column Product Main Layout */}
        <div className="al-product-main-grid">
          {/* Column 1: Image Gallery */}
          <div className="al-detail-gallery-col">
            <ProductGallery
              images={product.galleryImages || [product.image]}
              title={product.title}
              product={product}
            />
          </div>

          {/* Columns 2 & 3: Product Info (Center) & Buy Card (Right) */}
          <div className="al-detail-info-col">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
