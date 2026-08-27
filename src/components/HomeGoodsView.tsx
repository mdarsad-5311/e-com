"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  Truck, 
  ChevronRight,
  UtensilsCrossed,
  Wifi,
  Sofa,
  Sparkles,
  Lamp,
  Home
} from "lucide-react";
import { Product, products as allProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import "@/styles/home-goods.css";

interface HomeGoodsViewProps {
  products?: Product[];
}

const EXPLORE_CATEGORIES = [
  {
    icon: <Sofa size={22} />,
    title: "Ergonomic Furniture",
    subtitle: "Executive chairs, desks & storage",
    count: "18+ Products",
    href: "/products?q=furniture",
  },
  {
    icon: <Wifi size={22} />,
    title: "Smart Home & Audio",
    subtitle: "Voice automation, sensors & speakers",
    count: "24+ Products",
    href: "/products?q=smart-home",
  },
  {
    icon: <Lamp size={22} />,
    title: "Ambient Lighting",
    subtitle: "Smart LED bars, lamps & mood lights",
    count: "12+ Products",
    href: "/products?q=lighting",
  },
  {
    icon: <UtensilsCrossed size={22} />,
    title: "Kitchen & Dining",
    subtitle: "Precision appliances & tools",
    count: "15+ Products",
    href: "/products?q=kitchen",
  },
];

export default function HomeGoodsView({ products }: HomeGoodsViewProps) {
  const homeProducts = products && products.length > 0 
    ? products 
    : allProducts.filter((p) => p.category === "home-goods" || p.category === "home-living");

  return (
    <div className="al-home-goods-wrapper">
      {/* 1. HERO BANNER */}
      <section className="al-home-goods-hero">
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1800&q=85"
          alt="Modern Home Living & Ergonomic Workspace"
          fill
          priority
          sizes="100vw"
          className="al-home-hero-bg-img"
        />
        <div className="al-home-hero-overlay" />
        
        <div className="header-container al-home-hero-container">
          <div className="al-home-hero-content">
            <div className="al-home-hero-tag">
              <Sparkles size={13} />
              <span>Home &amp; Modern Living</span>
            </div>
            
            <h1 className="al-home-hero-title">
              Smart Living &amp;<br className="al-mobile-br" /> Modern Ergonomics
            </h1>
            
            <p className="al-home-hero-desc">
              Elevate your personal space with intelligent smart-home automation, ambient studio lighting, and high-performance ergonomic furniture.
            </p>
            
            <div className="al-home-hero-actions">
              <a href="#curated-spaces" className="al-btn-home-shop">
                <span>Explore Curated Spaces</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS CATALOG */}
      {homeProducts.length > 0 && (
        <section className="section al-home-products-section">
          <div className="header-container">
            <div className="section-header al-home-section-header">
              <div>
                <h2 className="al-spaces-heading">Featured Home &amp; Living</h2>
                <p className="al-spaces-subtitle">Precision engineered comfort and minimalist aesthetics for modern interiors.</p>
              </div>
              <Link href="/products?category=home-goods" className="al-view-all-link">
                <span>View All Collection</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="al-products-grid">
              {homeProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. CURATED SPACES SECTION */}
      <section id="curated-spaces" className="al-curated-spaces-section">
        <div className="header-container">
          <div className="section-header al-home-section-header">
            <div>
              <h2 className="al-spaces-heading">Curated Living Spaces</h2>
              <p className="al-spaces-subtitle">Handpicked furniture and smart electronics tailored for focus and relaxation.</p>
            </div>
          </div>

          <div className="al-spaces-grid-2col">
            {/* Space 1: Ergonomic Office */}
            <Link href="/products?q=office" className="al-space-card">
              <Image
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80"
                alt="Ergonomic Executive Office Setup"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="al-space-bg-img"
              />
              <div className="al-space-gradient-overlay" />
              <div className="al-space-content">
                <span className="al-space-pill">EXECUTIVE WORKSPACE</span>
                <h3 className="al-space-title">Ergonomic Office</h3>
                <p className="al-space-desc">Engineered for posture, all-day lumbar support, and deep work productivity.</p>
                <span className="al-space-explore-btn">
                  <span>Explore Office Gear</span>
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>

            {/* Space 2: Ambient Lighting */}
            <Link href="/products?q=lighting" className="al-space-card">
              <Image
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80"
                alt="Ambient Smart Lighting Studio"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="al-space-bg-img"
              />
              <div className="al-space-gradient-overlay" />
              <div className="al-space-content">
                <span className="al-space-pill">AMBIENT LIGHTING</span>
                <h3 className="al-space-title">Atmospheric Living</h3>
                <p className="al-space-desc">Dynamic color syncing, smart voice control, and ultra-warm night relaxation glows.</p>
                <span className="al-space-explore-btn">
                  <span>Explore Smart Lighting</span>
                  <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE CATEGORIES */}
      <section className="al-home-explore-cats-section">
        <div className="header-container">
          <div className="section-header al-home-section-header">
            <div>
              <h2 className="al-spaces-heading">Shop by Home Category</h2>
              <p className="al-spaces-subtitle">Find exactly what your living space requires.</p>
            </div>
          </div>

          <div className="al-home-cat-grid">
            {EXPLORE_CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="al-home-cat-card">
                <div className="al-home-cat-icon-box">
                  {cat.icon}
                </div>
                <div className="al-home-cat-text">
                  <span className="al-home-cat-title">{cat.title}</span>
                  <span className="al-home-cat-subtitle">{cat.subtitle}</span>
                  <span className="al-home-cat-count">{cat.count}</span>
                </div>
                <div className="al-home-cat-arrow-box">
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VALUE PROPS / TRUST BADGES STRIP */}
      <section className="al-home-trust-strip">
        <div className="header-container">
          <div className="al-home-trust-grid">
            <div className="al-home-trust-item">
              <div className="al-home-trust-icon-circle"><ShieldCheck size={22} /></div>
              <div className="al-home-trust-text">
                <h4 className="al-home-trust-title">Al-Umaima Assured</h4>
                <p className="al-home-trust-desc">Every piece undergoes durability testing and ergonomic certification before dispatch.</p>
              </div>
            </div>
            <div className="al-home-trust-item">
              <div className="al-home-trust-icon-circle"><ShieldAlert size={22} /></div>
              <div className="al-home-trust-text">
                <h4 className="al-home-trust-title">2-Year Premium Warranty</h4>
                <p className="al-home-trust-desc">Comprehensive mechanical and electronic warranty coverage on all home products.</p>
              </div>
            </div>
            <div className="al-home-trust-item">
              <div className="al-home-trust-icon-circle"><Truck size={22} /></div>
              <div className="al-home-trust-text">
                <h4 className="al-home-trust-title">White Glove Delivery</h4>
                <p className="al-home-trust-desc">Complimentary room placement and packaging recycling for large furniture items.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
