"use client";

import Link from "next/link";
import { ChevronRight, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import "@/styles/cart-page.css";

export default function CartPage() {
  const { cart, clearCart, totalItemsCount } = useCart();

  return (
    <div className="container section">
      {/* Cart Page Title */}
      <div className="cart-page-header">
        <div>
          <h1 className="section-title">Your Shopping Cart</h1>
          <p className="section-subtitle">
            {totalItemsCount > 0
              ? `You have ${totalItemsCount} item${totalItemsCount === 1 ? "" : "s"} ready for checkout`
              : "Your shopping cart is currently empty"}
          </p>
        </div>

        {cart.length > 0 && (
          <button onClick={clearCart} className="clear-cart-btn" title="Clear all items">
            <Trash2 size={16} /> Clear Cart
          </button>
        )}
      </div>

      {/* Cart Main Content Grid */}
      {cart.length > 0 ? (
        <div className="cart-layout-grid">
          {/* Left Column: Cart Items */}
          <div className="cart-items-column">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}

            <div className="cart-actions-row">
              <Link href="/products" className="btn btn-secondary continue-shopping-btn">
                <ArrowLeft size={18} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="cart-summary-column">
            <OrderSummary />
          </div>
        </div>
      ) : (
        /* Empty Cart State */
        <div className="empty-cart-card glass-card">
          <div className="empty-cart-icon-wrapper">
            <ShoppingBag size={48} />
          </div>
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-text">
            Looks like you haven&apos;t added any products to your shopping cart yet.
          </p>
          <Link href="/products" className="btn btn-primary start-shopping-btn">
            Discover Popular Products <ChevronRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
