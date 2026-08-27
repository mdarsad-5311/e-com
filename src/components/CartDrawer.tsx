"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUI } from "@/context/UIContext";
import "@/styles/cart-drawer.css";

export default function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, totalItemsCount, subtotal } = useCart();
  const { isCartOpen, closeCart } = useUI();

  if (!isCartOpen) return null;

  const shippingHint = subtotal >= 250 ? "You unlocked free shipping" : `Add $${(250 - subtotal).toFixed(2)} more for free shipping`;

  return (
    <div className="drawer-backdrop" onClick={closeCart}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Shopping cart">
        <header className="drawer-header">
          <div>
            <h2>Your bag</h2>
            <p>{totalItemsCount} item{totalItemsCount === 1 ? "" : "s"}</p>
          </div>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={22} />
          </button>
        </header>

        <div className="shipping-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min(100, (subtotal / 250) * 100)}%` }} />
          </div>
          <span>{shippingHint}</span>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-drawer">
              <ShoppingBag size={36} />
              <p>Your bag is empty</p>
              <Link href="/products" className="btn btn-primary" onClick={closeCart}>
                Start shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="drawer-item">
                <img src={item.product.image} alt={item.product.title} />
                <div className="item-meta">
                  <Link href={`/products/${item.product.id}`} onClick={closeCart}>
                    {item.product.title}
                  </Link>
                  <strong>${item.product.price.toFixed(2)}</strong>
                  <div className="qty-row">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label="Decrease">
                      <Minus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase">
                      <Plus size={12} />
                    </button>
                    <button className="remove" onClick={() => removeFromCart(item.product.id)} aria-label="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <footer className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <p className="tax-note">Shipping & tax calculated at checkout</p>
            <Link href="/checkout" className="btn btn-primary full" onClick={closeCart}>
              Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/cart" className="btn btn-outline full" onClick={closeCart}>
              View cart
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
