"use client";

import { useState, FormEvent } from "react";
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, X } from "lucide-react";
import { Review } from "@/data/products";
import "@/styles/product-reviews.css";

interface ProductReviewsProps {
  reviews?: Review[];
  rating: number;
  reviewsCount: number;
}

export default function ProductReviews({ reviews: initialReviews = [], rating, reviewsCount }: ProductReviewsProps) {
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [newAuthor, setNewAuthor] = useState<string>("");

  const handleAddReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim() || !newAuthor.trim()) return;

    const createdReview: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      rating: newRating,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      title: newTitle,
      comment: newComment,
      verified: true,
    };

    setReviewsList([createdReview, ...reviewsList]);
    setIsFormOpen(false);
    setNewTitle("");
    setNewComment("");
    setNewAuthor("");
  };

  return (
    <div id="reviews-section" className="reviews-section section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Customer Ratings & Reviews</h2>
          <p className="section-subtitle">Real feedback from verified buyers</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsFormOpen(true)}
        >
          <MessageSquarePlus size={18} /> Write a Review
        </button>
      </div>

      {/* Rating Breakdown Grid */}
      <div className="reviews-summary-grid glass-card">
        {/* Left Rating Score Banner */}
        <div className="overall-score-card">
          <div className="score-number">{rating.toFixed(1)}</div>
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                fill={star <= Math.round(rating) ? "#f59e0b" : "none"}
                color={star <= Math.round(rating) ? "#f59e0b" : "#cbd5e1"}
              />
            ))}
          </div>
          <div className="total-reviews-count">Based on {reviewsCount + reviewsList.length - initialReviews.length} reviews</div>
        </div>

        {/* Right Star Breakdown Progress Bars */}
        <div className="rating-bars-column">
          {[
            { label: "5 Stars", percentage: 84 },
            { label: "4 Stars", percentage: 12 },
            { label: "3 Stars", percentage: 3 },
            { label: "2 Stars", percentage: 1 },
            { label: "1 Star", percentage: 0 },
          ].map((bar, idx) => (
            <div key={idx} className="bar-row">
              <span className="bar-label">{bar.label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${bar.percentage}%` }}></div>
              </div>
              <span className="bar-percent">{bar.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviewsList.length > 0 ? (
          reviewsList.map((rev) => (
            <div key={rev.id} className="review-card glass-card">
              <div className="review-header">
                <div className="author-info">
                  <img
                    src={rev.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                    alt={rev.author}
                    className="author-avatar"
                  />
                  <div>
                    <div className="author-name-row">
                      <span className="author-name">{rev.author}</span>
                      {rev.verified && (
                        <span className="verified-badge">
                          <CheckCircle size={12} /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="review-date">{rev.date}</div>
                  </div>
                </div>

                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill={star <= rev.rating ? "#f59e0b" : "none"}
                      color={star <= rev.rating ? "#f59e0b" : "#cbd5e1"}
                    />
                  ))}
                </div>
              </div>

              <h4 className="review-title">{rev.title}</h4>
              <p className="review-comment">{rev.comment}</p>

              <div className="review-footer">
                <button className="helpful-btn">
                  <ThumbsUp size={14} /> Helpful (4)
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-reviews glass-card">
            <p>No customer reviews submitted yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      {isFormOpen && (
        <div className="review-modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="review-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a Product Review</h3>
              <button className="close-modal" onClick={() => setIsFormOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="review-form">
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="star-pick-btn"
                    >
                      <Star
                        size={24}
                        fill={star <= newRating ? "#f59e0b" : "none"}
                        color={star <= newRating ? "#f59e0b" : "#cbd5e1"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Vance"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Review Headline</label>
                <input
                  type="text"
                  placeholder="Summarize your experience..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Review Details</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you liked or disliked about this product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="form-textarea"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
