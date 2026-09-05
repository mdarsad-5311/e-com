"use client";

import { useState, ImgHTMLAttributes } from "react";
import Image from "next/image";


interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackCategory?: string;
}

export default function SafeImage({
  src,
  alt = "Product image",
  className = "",
  fallbackCategory,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Fallback SVG data URI with beautiful gradient and clean icon placeholder
  const placeholderSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23e0e7ff"/><g fill="%236366f1" opacity="0.6" transform="translate(110, 110)"><rect x="10" y="10" width="60" height="60" rx="8" fill="none" stroke="%236366f1" stroke-width="4"/><circle cx="30" cy="30" r="6"/><polyline points="15 60 35 40 50 55 65 35 75 55" fill="none" stroke="%236366f1" stroke-width="4"/></g></svg>`;

  return (
    <Image width={500} height={500}
      src={hasError || !src ? placeholderSvg : src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
}
