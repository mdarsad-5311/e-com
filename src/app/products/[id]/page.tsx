import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { products, Product } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductViewTracker from "@/components/ProductViewTracker";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import ProductReviews from "@/components/ProductReviews";
import RecentlyViewed from "@/components/RecentlyViewed";

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

export function generateMetadata({ params }: ProductDetailPageProps): Metadata {
  const { id } = params;
  const decodedId = decodeURIComponent(id);
  const product = products.find(
    (p: Product) => p.id === decodedId || p.slug === decodedId || p.id === id || p.slug === id
  );

  if (!product) {
    return {
      title: "Product Not Found | Al-Umaima",
    };
  }

  return {
    title: `${product.title} | Al-Umaima Premium`,
    description: product.description || `Shop ${product.title} with 2-year warranty and free express shipping at Al-Umaima.`,
    openGraph: {
      title: `${product.title} - $${product.price.toFixed(2)} | Al-Umaima`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  };
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
  const productUrl = `https://e-com-five-pink.vercel.app/products/${product.slug || product.id}`;

  // JSON-LD Product & Breadcrumb Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        "name": product.title,
        "image": product.galleryImages || [product.image],
        "description": product.description || `${product.title} available on Al-Umaima.`,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "Al-Umaima"
        },
        "offers": {
          "@type": "Offer",
          "url": productUrl,
          "priceCurrency": "USD",
          "price": product.price.toFixed(2),
          "priceValidUntil": "2028-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Al-Umaima Commerce"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating || "4.8",
          "reviewCount": product.reviewsCount || "312",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://e-com-five-pink.vercel.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": categoryName,
            "item": `https://e-com-five-pink.vercel.app/category/${product.category}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.title,
            "item": productUrl
          }
        ]
      }
    ]
  };

  return (
    <div className="al-product-detail-page">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container">
        <ProductViewTracker product={product} />

        {/* Dynamic Breadcrumbs */}
        <nav className="al-detail-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="al-crumb-link">Home</Link>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <Link href={`/category/${product.category}`} className="al-crumb-link">{categoryName}</Link>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <span className="al-crumb-link">{subCategory}</span>
          <ChevronRight size={13} className="al-crumb-chevron" />
          <span className="al-crumb-current" aria-current="page">{product.title}</span>
        </nav>

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

        {/* Frequently Bought Together Bundle Builder */}
        <FrequentlyBoughtTogether currentProduct={product} />

        {/* Verified Customer Reviews */}
        <ProductReviews
          reviews={product.reviews || []}
          rating={product.rating || 4.8}
          reviewsCount={product.reviewsCount || 312}
        />

        {/* Recently Viewed Products */}
        <RecentlyViewed />
      </div>
    </div>
  );
}
