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
  const paramList: { id: string }[] = [];
  products.forEach((prod: Product) => {
    paramList.push({ id: prod.id });
    if (prod.slug && prod.slug !== prod.id) {
      paramList.push({ id: prod.slug });
    }
  });
  return paramList;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const decodedId = decodeURIComponent(id);
  const product = products.find(
    (p: Product) => p.id === decodedId || p.slug === decodedId || p.id === id || p.slug === id
  );

  if (!product) {
    notFound();
  }

  const categoryName = product.categoryName || (product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "Products");
  const subCategory = product.subCategory || "Items";

  return (
    <div className="al-product-detail-page">
      <div className="container">
        <ProductViewTracker product={product} />

        {/* Dynamic Breadcrumbs */}
        <div className="al-detail-breadcrumbs">
          <Link href="/" className="al-crumb-link">Home</Link>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <Link href={`/category/${product.category}`} className="al-crumb-link">{categoryName}</Link>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <span className="al-crumb-link">{subCategory}</span>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <span className="al-crumb-current">{product.title}</span>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="al-product-detail-grid">
          {/* Left Column: Big Product Image Showcase */}
          <div className="al-detail-media-column">
            <ProductGallery
              images={product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : [product.image]}
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

