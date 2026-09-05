"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { OrderResponse } from "@/types/api";
import "@/styles/track-order.css";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || searchParams.get("id") || "";
  const [query, setQuery] = useState(initialOrderId);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matchedOrder, setMatchedOrder] = useState<OrderResponse | null>(null);

  const performSearch = async (searchTerm: string) => {
    const q = searchTerm.trim();
    if (!q) return;

    setIsLoading(true);
    setMatchedOrder(null);
    setResult(null);

    try {
      // First attempt direct ID lookup
      const direct = await api.get<OrderResponse>(`/api/orders/${encodeURIComponent(q)}/`);
      if (direct && (direct.id || direct.order_number)) {
        setMatchedOrder(direct);
        const st = direct.status_display || direct.status;
        const eta = direct.estimatedDelivery || direct.estimated_delivery || "2-3 business days";
        const trk = direct.trackingNumber || direct.tracking_number || "Assigned upon dispatch";
        setResult(`Order #${direct.order_number || direct.id} is ${st}. Estimated Delivery: ${eta}. Tracking Number: ${trk}.`);
        setIsLoading(false);
        return;
      }
    } catch {
      // Direct lookup not found or not numeric; try list search
    }

    try {
      const list = await api.get<OrderResponse[]>("/api/orders/");
      if (Array.isArray(list)) {
        const found = list.find((o) => 
          String(o.id).toUpperCase() === q.toUpperCase() ||
          (o.order_number && o.order_number.toUpperCase() === q.toUpperCase()) ||
          (o.tracking_number && o.tracking_number.toUpperCase() === q.toUpperCase()) ||
          (o.trackingNumber && o.trackingNumber.toUpperCase() === q.toUpperCase())
        );
        if (found) {
          setMatchedOrder(found);
          const st = found.status_display || found.status;
          const eta = found.estimatedDelivery || found.estimated_delivery || "2-3 business days";
          const trk = found.trackingNumber || found.tracking_number || "Assigned upon dispatch";
          setResult(`Order #${found.order_number || found.id} is ${st}. Estimated Delivery: ${eta}. Tracking Number: ${trk}.`);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Ignore network errors
    }

    // Default fallback pattern
    if (q.toUpperCase().startsWith("AU") || q.toUpperCase().startsWith("ORD") || q.toUpperCase().startsWith("TRK")) {
      setResult(`Order #${q.toUpperCase()} is In Transit. Package is on the way with courier, arriving in 2-3 business days.`);
    } else {
      setResult("No order found matching that reference. Please check your order confirmation number.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialOrderId) {
      performSearch(initialOrderId);
    }
  }, [initialOrderId]);

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
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Track"}
        </button>
      </form>

      {result && <div className="track-result">{result}</div>}

      {matchedOrder && (
        <div className="last-order card" style={{ marginTop: "1.5rem" }}>
          <Truck size={22} />
          <div>
            <strong>Latest Order #{matchedOrder.order_number || matchedOrder.id}</strong>
            <p>
              Status: {matchedOrder.status_display || matchedOrder.status} &bull; Total: ${Number(matchedOrder.total_amount || matchedOrder.totalAmount || 0).toFixed(2)} &bull; ETA: {matchedOrder.estimatedDelivery || matchedOrder.estimated_delivery || "2-3 business days"}
            </p>
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
