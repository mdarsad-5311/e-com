"use client";

import "@/styles/skeleton-card.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card-item">
      {/* Image Skeleton */}
      <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "10px" }} />
      
      {/* Category Skeleton */}
      <div className="skeleton" style={{ width: "35%", height: "14px", marginTop: "0.85rem", marginBottom: "0.4rem" }} />
      
      {/* Title Skeleton */}
      <div className="skeleton" style={{ width: "85%", height: "20px", marginBottom: "0.75rem" }} />
      
      {/* Footer Price & Button Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--borders)" }}>
        <div className="skeleton" style={{ width: "30%", height: "24px" }} />
        <div className="skeleton" style={{ width: "38px", height: "38px", borderRadius: "10px" }} />
      </div>
    </div>
  );
}
