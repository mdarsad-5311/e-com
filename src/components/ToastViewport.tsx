"use client";

import { CheckCircle2, Info, X, AlertCircle } from "lucide-react";
import { useToast, ToastItem } from "@/context/ToastContext";
import "@/styles/toast-viewport.css";

function ToastIcon({ type }: { type: ToastItem["type"] }) {
  if (type === "error") return <AlertCircle size={18} />;
  if (type === "info") return <Info size={18} />;
  return <CheckCircle2 size={18} />;
}

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <ToastIcon type={toast.type} />
          <span>{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
