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
            />
          </div>

          {/* Columns 2 & 3: Product Info (Center) & Buy Card (Right) */}
          <div className="al-detail-info-col">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      <style>{`
        .al-product-detail-page {
          background-color: #ffffff;
          padding: 1.5rem 0 4rem;
          min-height: 80vh;
        }

        .al-detail-breadcrumb-wrap {
          margin-bottom: 1.5rem;
        }

        .al-product-main-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 2.5rem;
          align-items: flex-start;
        }

        @media (max-width: 1200px) {
          .al-product-main-grid {
            grid-template-columns: 400px 1fr;
            gap: 1.75rem;
          }
        }

        @media (max-width: 990px) {
          .al-product-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
