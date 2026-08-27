"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "@/styles/track-order.css";

interface LastOrder {
  id: string;
  total: number;
  status: string;
  shippingTo: string;
  eta: string;
}

function TrackOrderContent() {
  const { orders } = useAuth();
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || searchParams.get("id") || "";
  const [query, setQuery] = useState(initialOrderId);
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

  const performSearch = (searchTerm: string) => {
    const q = searchTerm.trim().toUpperCase();
    if (!q) return;

    const fromAuth = orders.find(
      (o) => o.id.toUpperCase() === q || o.trackingNumber?.toUpperCase() === q || o.id.toUpperCase().includes(q)
    );
    if (fromAuth) {
      setResult(`${fromAuth.id} is ${fromAuth.status}. Estimated Delivery: ${fromAuth.estimatedDelivery}. Tracking Number: ${fromAuth.trackingNumber || "TRK-8819203"}.`);
      return;
    }
    if (lastOrder && (lastOrder.id.toUpperCase() === q || lastOrder.id.toUpperCase().includes(q))) {
      setResult(`${lastOrder.id} is ${lastOrder.status}. Estimated delivery ${lastOrder.eta} to ${lastOrder.shippingTo}.`);
      return;
    }
    // Match any mock order pattern
    if (q.startsWith("AU") || q.startsWith("ORD") || q.startsWith("TRK")) {
      setResult(`Order #${q} is In Transit. Package is on the way with courier, arriving in 2-3 business days.`);
      return;
    }
    setResult("No order found. Try ORD-98214, AU-98241, or your latest confirmation number.");
  };

  useEffect(() => {
    if (initialOrderId) {
      performSearch(initialOrderId);
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    performSearch(query);
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
          placeholder="e.g. ORD-98214 or AU-98241"
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
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container section" style={{ textAlign: "center" }}>Loading tracking status...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

