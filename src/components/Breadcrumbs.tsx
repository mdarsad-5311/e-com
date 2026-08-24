"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import "@/styles/breadcrumbs.css";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={`${item.label}-${idx}`} className="crumb">
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          {idx < items.length - 1 && <ChevronRight size={14} />}
        </span>
      ))}
    </nav>
  );
}
