import SkeletonCard from "@/components/SkeletonCard";

export default function GlobalLoading() {
  return (
    <div className="container section">
      {/* Header Skeleton */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="skeleton-box" style={{ width: "240px", height: "36px", marginBottom: "0.8rem" }} />
        <div className="skeleton-box" style={{ width: "380px", height: "18px" }} />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="products-grid">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
