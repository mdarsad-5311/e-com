"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  Truck, 
  ChevronRight,
  UtensilsCrossed,
  Wifi,
  Sofa
} from "lucide-react";
import { Product, products as allProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import "@/styles/home-goods.css";

interface HomeGoodsViewProps {
  products?: Product[];
}

const EXPLORE_CATEGORIES = [
  {
    icon: <UtensilsCrossed size={20} />,
    title: "Kitchen Essentials",
    subtitle: "Smart appliances & tools",
    href: "/products?q=kitchen",
  },
  {
    icon: <Wifi size={20} />,
    title: "Smart Home",
    subtitle: "Automation & security",
    href: "/products?q=smart-home",
  },
  {
    icon: <Sofa size={20} />,
    title: "Furniture",
    subtitle: "Ergonomic & stylish",
    href: "/products?q=furniture",
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
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1800&q=80"
          alt="Modern Home Living Interior"
          className="al-home-hero-bg-img"
        />
        <div className="al-home-hero-overlay" />
        <div className="al-home-hero-content-wrap">
          <div className="al-home-hero-content">
            <span className="al-home-hero-tag">Home &amp; Living</span>
            <h1 className="al-home-hero-title">
              Smart Living &amp;<br className="al-mobile-br" /> Ergonomics
            </h1>
            <p className="al-home-hero-desc">
              Elevate your space with intelligent design and premium comfort.
            </p>
            <a href="#curated-spaces" className="al-btn-home-shop">
              Shop the Collection
            </a>
          </div>
        </div>
      </section>

      {/* 2. PRODUCTS GRID */}
      {homeProducts.length > 0 && (
        <section className="section" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
          <div className="header-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 className="al-spaces-heading">Featured Home Goods</h2>
              <Link href="/products?category=home-goods" style={{ color: "#FF7A00", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}>
                View All <ArrowRight size={15} />
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

      {/* 3. CURATED SPACES */}
      <section id="curated-spaces" className="al-curated-spaces-section">
        <div className="header-container">
          <div className="al-spaces-header-row">
            <h2 className="al-spaces-heading">Curated Spaces</h2>
          </div>

          {/* Mobile: stacked full-width cards | Desktop: bento grid */}
          <div className="al-spaces-stack">
            {/* Card 1: Ergonomic Office */}
            <Link href="/products?q=office" className="al-space-stack-card">
              <img
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80"
                alt="Ergonomic Office Setup"
                className="al-space-bg-img"
              />
              <div className="al-space-gradient-overlay" />
              <div className="al-space-stack-content">
                <h3 className="al-space-stack-title">Ergonomic Office</h3>
                <p className="al-space-stack-desc">Designed for focus and posture.</p>
                <span className="al-space-explore-link">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Card 2: Ambient Lighting */}
            <Link href="/products?q=lighting" className="al-space-stack-card">
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
                alt="Ambient Lighting"
                className="al-space-bg-img"
              />
              <div className="al-space-gradient-overlay" />
              <div className="al-space-stack-content">
                <h3 className="al-space-stack-title">Ambient Lighting</h3>
                <p className="al-space-stack-desc">Set the mood with smart LEDs.</p>
                <span className="al-space-explore-link">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE CATEGORIES */}
      <section className="al-home-explore-cats-section">
        <div className="header-container">
          <h2 className="al-spaces-heading" style={{ marginBottom: "1rem" }}>Explore Categories</h2>
          <div className="al-home-cat-list">
            {EXPLORE_CATEGORIES.map((cat) => (
              <Link key={cat.title} href={cat.href} className="al-home-cat-row">
                <div className="al-home-cat-icon-box">
                  {cat.icon}
                </div>
                <div className="al-home-cat-text">
                  <span className="al-home-cat-title">{cat.title}</span>
                  <span className="al-home-cat-subtitle">{cat.subtitle}</span>
                </div>
                <ChevronRight size={18} className="al-home-cat-chevron" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VALUE PROPS / TRUST BADGES STRIP (Desktop) */}
      <section className="al-home-trust-strip al-desktop-only">
        <div className="header-container">
          <div className="al-home-trust-grid">
            <div className="al-home-trust-item">
              <div className="al-home-trust-icon-circle"><ShieldCheck size={22} /></div>
              <div className="al-home-trust-text">
                <h4 className="al-home-trust-title">Al-Umaima Assured</h4>
                <p className="al-home-trust-desc">Every product undergoes rigorous testing for durability and ergonomic compliance.</p>
              </div>
            </div>
            <div className="al-home-trust-item">
              <div className="al-home-trust-icon-circle"><ShieldAlert size={22} /></div>
              <div className="al-home-trust-text">
                <h4 className="al-home-trust-title">2-Year Premium Warranty</h4>
                <p className="al-home-trust-desc">Comprehensive coverage on all Home &amp; Living electronics and furniture pieces.</p>
              </div>
            </div>
            <div className="al-home-trust-item">
              <div className="al-home-trust-icon-circle"><Truck size={22} /></div>
              <div className="al-home-trust-text">
                <h4 className="al-home-trust-title">White Glove Delivery</h4>
                <p className="al-home-trust-desc">Complimentary setup and packaging removal for large furniture items.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

