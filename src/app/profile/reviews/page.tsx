"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ChevronRight, Edit3, Trash2, X, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import "@/styles/profile.css";
import Image from "next/image";


export default function MyReviewsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Route Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=" + encodeURIComponent("/profile/reviews"));
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    let isMounted = true;
    const fetchMyReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/my-reviews/");
        if (isMounted) {
          setReviews(Array.isArray(res) ? res : (res.results || []));
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (user) {
      fetchMyReviews();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDelete = async (reviewId: number | string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/api/reviews/${reviewId}/`);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showToast("Review deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete review.");
    }
  };

  const handleOpenEdit = (review: any) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditTitle(review.title || "");
    setEditComment(review.comment || "");
    setErrorMsg(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    if (!editComment.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const updated = await api.patch(`/api/reviews/${editingReview.id}/`, {
        rating: editRating,
        title: editTitle,
        comment: editComment,
      });

      setReviews((prev) => prev.map((r) => (r.id === editingReview.id ? updated : r)));
      setEditingReview(null);
      showToast("Review updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="al-profile-page" style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading your reviews...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="al-profile-page">
      <div className="container" style={{ padding: "2rem 1rem" }}>
        <div className="al-breadcrumb" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          <Link href="/profile" className="al-crumb-link" style={{ color: "var(--primary)" }}>Your Account</Link>
          <ChevronRight size={13} />
          <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>My Reviews</span>
        </div>

        <h1 style={{ fontSize: "1.75rem", marginBottom: "2rem", color: "var(--text-primary)" }}>My Reviews</h1>

        {reviews.length === 0 ? (
          <div className="al-empty-state" style={{ padding: "4rem 2rem", textAlign: "center", backgroundColor: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            <Star size={40} style={{ margin: "0 auto 1rem", color: "var(--border)" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>No reviews yet</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>You haven&apos;t written any product reviews.</p>
            <Link href="/orders" className="al-btn-primary">
              Review Past Orders
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    {rev.product_image && (
                      <Link href={`/products/${rev.product_slug}`}>
                        <Image width={500} height={500} src={rev.product_image} alt={rev.product_name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
                      </Link>
                    )}
                    <div>
                      <Link href={`/products/${rev.product_slug}`} style={{ fontWeight: "600", color: "var(--text-primary)", textDecoration: "none", fontSize: "1.05rem" }}>
                        {rev.product_name}
                      </Link>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                        {new Date(rev.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="button" onClick={() => handleOpenEdit(rev)} style={{ padding: "0.4rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }} title="Edit Review">
                      <Edit3 size={18} />
                    </button>
                    <button type="button" onClick={() => handleDelete(rev.id)} style={{ padding: "0.4rem", background: "none", border: "none", color: "var(--error, #ef4444)", cursor: "pointer" }} title="Delete Review">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} fill={star <= rev.rating ? "#f59e0b" : "none"} color={star <= rev.rating ? "#f59e0b" : "#cbd5e1"} />
                    ))}
                  </div>
                  {rev.title && <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", color: "var(--text-primary)" }}>{rev.title}</h4>}
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <div className="al-modal-backdrop" onClick={() => setEditingReview(null)}>
          <div className="al-profile-modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: "2rem" }}>
            <div className="al-modal-head" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Edit Review</h3>
              <button type="button" onClick={() => setEditingReview(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--error, #ef4444)", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <AlertCircle size={16} />
                <span style={{ fontSize: "0.85rem" }}>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Rating</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <Star size={24} fill={star <= editRating ? "#f59e0b" : "none"} color={star <= editRating ? "#f59e0b" : "#cbd5e1"} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Headline</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                />
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Comment</label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows={4}
                  required
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" onClick={() => setEditingReview(null)} style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "none", color: "var(--text-primary)", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "none", background: "var(--primary)", color: "white", cursor: "pointer" }}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
