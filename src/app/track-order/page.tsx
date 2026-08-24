"use client";

import { FormEvent, useEffect, useState } from "react";
import { PackageSearch, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LastOrder {
  id: string;
  total: number;
  status: string;
  shippingTo: string;
  eta: string;
}

export default function TrackOrderPage() {
  const { orders } = useAuth();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aurastore_last_order");
      if (raw) setLastOrder(JSON.parse(raw) as LastOrder);
    } catch {
      /* ignore */
    }
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim().toUpperCase();
    const fromAuth = orders.find((o) => o.id.toUpperCase() === q || o.trackingNumber?.toUpperCase() === q);
    if (fromAuth) {
      setResult(`${fromAuth.id} is ${fromAuth.status}. Tracking: ${fromAuth.trackingNumber || "assigned soon"}.`);
      return;
    }
    if (lastOrder && (lastOrder.id.toUpperCase() === q)) {
      setResult(`${lastOrder.id} is ${lastOrder.status}. Estimated delivery ${lastOrder.eta} to ${lastOrder.shippingTo}.`);
      return;
    }
    setResult("No order found. Try ORD-94821 or your latest confirmation number.");
  };

  return (
    <div className="container section">
      <h1 className="section-title">Track your order</h1>
      <p className="section-subtitle">Enter an order ID or tracking number to see live status.</p>

      <form onSubmit={handleSearch} className="track-form">
        <PackageSearch size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. ORD-94821 or TRK-98214-US"
        />
        <button className="btn btn-primary" type="submit">Track</button>
      </form>

      {result && <div className="track-result">{result}</div>}

      {lastOrder && (
        <div className="last-order card">
          <Truck size={18} />
          <div>
            <strong>Latest order {lastOrder.id}</strong>
            <p>{lastOrder.status} · ${lastOrder.total.toFixed(2)} · ETA {lastOrder.eta}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .track-form {
          margin-top: 1.5rem;
          max-width: 640px;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #fff;
          border: 1px solid var(--borders);
          border-radius: 12px;
          padding: 0.5rem 0.75rem;
        }
        .track-form input {
          flex: 1;
          border: none;
          outline: none;
          height: 44px;
          font-size: 0.95rem;
        }
        .track-result {
          margin-top: 1rem;
          background: var(--primary-light);
          color: var(--text);
          padding: 1rem 1.15rem;
          border-radius: 12px;
          font-weight: 600;
          max-width: 640px;
        }
        .last-order {
          margin-top: 1.25rem;
          max-width: 640px;
          padding: 1rem 1.15rem;
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
