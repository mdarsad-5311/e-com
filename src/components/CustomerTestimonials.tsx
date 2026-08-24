"use client";

import { Star, CheckCircle, Quote, Sparkles } from "lucide-react";
import "@/styles/customer-testimonials.css";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  productBought: string;
  comment: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Marcus Sterling",
    role: "Verified Buyer • Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    productBought: "Aura ANC Wireless Headphones",
    comment: "The noise cancellation is on par with premium flagship headphones costing double. Battery life genuinely lasts all week!",
    date: "August 16, 2026",
  },
  {
    id: "test-2",
    name: "Elena Rostova",
    role: "Verified Buyer • Designer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    productBought: "Minimalist Weatherproof Parka",
    comment: "Sublime build quality. The fit is clean, waterproof coating actually works in torrential rain, and shipping arrived in 2 days.",
    date: "August 10, 2026",
  },
  {
    id: "test-3",
    name: "David K. Chen",
    role: "Verified Buyer • Smart Home Collector",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    productBought: "Aura Smart Ambient Light Bar",
    comment: "Seamless integration with smart voice assistants. The responsive sync mode for movies and gaming completely changed my desk setup.",
    date: "July 29, 2026",
  },
];

export default function CustomerTestimonials() {
  return (
    <section className="testimonials-section section">
      <div className="container">
        <div className="section-header text-center">
          <div>
            <div className="section-badge" style={{ margin: "0 auto 0.8rem" }}>
              <Sparkles size={14} /> LOVED BY 50,000+ SHOPPERS
            </div>
            <h2 className="section-title">What Our Community Says</h2>
            <p className="section-subtitle">Real experiences from verified Al-Umaima shoppers worldwide</p>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card glass-card">
              <div className="card-top-row">
                <div className="stars-row">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#FBBF24" color="#FBBF24" />
                  ))}
                </div>
                <span className="verified-pill">
                  <CheckCircle size={12} /> Verified Purchase
                </span>
              </div>

              <Quote size={28} className="quote-icon" />

              <p className="testimonial-text">&ldquo;{item.comment}&rdquo;</p>

              <div className="product-tag font-mono">
                Purchased: <strong>{item.productBought}</strong>
              </div>

              <div className="user-profile-row">
                <img src={item.avatar} alt={item.name} className="user-avatar" />
                <div>
                  <h4 className="user-name">{item.name}</h4>
                  <p className="user-role">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
