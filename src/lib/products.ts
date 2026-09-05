import { api, getBaseApiUrl } from "@/lib/api";
import { Product, products } from "@/data/products";

export interface ProductQueryParams {
  category?: string | number;
  category_id?: string | number;
  search?: string;
  q?: string;
  min_price?: number | string;
  max_price?: number | string;
  in_stock?: boolean | string;
  inStock?: boolean | string;
  featured?: boolean | string;
  deal?: boolean | string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: any;
}

export interface PaginatedProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

/**
 * Safely extracts items from either a DRF paginated response ({ count, results })
 * or a direct array response.
 */
export function extractResults(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.data)) return response.data;
  return [];
}

/**
 * Format image URL: resolve relative media paths against the Django base API URL,
 * keep Cloudinary / Unsplash external URLs intact, or return a reliable fallback image.
 */
export function formatProductImageUrl(imgUrl?: string | null): string {
  if (!imgUrl || typeof imgUrl !== "string" || imgUrl.trim() === "") {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";
  }
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://") || imgUrl.startsWith("data:")) {
    return imgUrl;
  }
  const baseUrl = getBaseApiUrl();
  const cleanPath = imgUrl.startsWith("/") ? imgUrl : `/${imgUrl}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Maps a Django ProductSerializer response object to the existing frontend Product interface.
 * Preserves all frontend expectations: title, price, originalPrice, rating, reviewsCount,
 * image, galleryImages, isFeatured, isBestSeller, isDealOfTheDay, stock, etc.
 */
export function mapDjangoProductToFrontendProduct(item: any): Product {
  if (!item) {
    return {} as Product;
  }

  // Resolve primary image
  let primaryImage = formatProductImageUrl(item.image);
  const galleryImages: string[] = [];

  if (Array.isArray(item.images) && item.images.length > 0) {
    item.images.forEach((imgObj: any) => {
      const u = formatProductImageUrl(imgObj?.image || imgObj?.url || imgObj);
      galleryImages.push(u);
      if (imgObj?.is_primary) {
        primaryImage = u;
      }
    });
  }

  if (!galleryImages.includes(primaryImage)) {
    galleryImages.unshift(primaryImage);
  }

  // Price calculations
  const rawOriginal = Number(item.price ?? item.original_price ?? item.origPrice ?? 0);
  const rawDiscounted = item.discounted_price !== null && item.discounted_price !== undefined
    ? Number(item.discounted_price)
    : undefined;
  const rawDiscountPct = Number(item.discount_percentage ?? item.discount ?? 0);

  let price = rawOriginal;
  let originalPrice: number | undefined = undefined;

  if (rawDiscounted !== undefined && rawDiscounted > 0 && rawDiscounted < rawOriginal) {
    price = rawDiscounted;
    originalPrice = rawOriginal;
  } else if (rawDiscountPct > 0) {
    originalPrice = rawOriginal;
    price = Number((rawOriginal * (1 - rawDiscountPct / 100)).toFixed(2));
  } else if (item.original_price && Number(item.original_price) > rawOriginal) {
    originalPrice = Number(item.original_price);
  } else if (item.origPrice && Number(item.origPrice) > rawOriginal) {
    originalPrice = Number(item.origPrice);
  }

  // Category resolution
  let categorySlug = "general";
  let categoryName = "General";

  if (item.category && typeof item.category === "object") {
    categorySlug = item.category.slug || String(item.category.id || "general");
    categoryName = item.category.name || categorySlug;
  } else if (typeof item.category === "string") {
    categorySlug = item.category;
    categoryName = item.categoryName || item.category;
  }

  const rating = Number(item.rating ?? 4.8);
  const reviewsCount = Number(item.reviews_count ?? item.review_count ?? item.rating_count ?? 128);
  const isFeatured = Boolean(item.is_featured);
  const isDeal = Boolean(item.is_deal || (rawDiscountPct >= 15));
  const isBestSeller = Boolean(
    item.is_bestseller ?? item.isBestSeller ?? (rating >= 4.7 && reviewsCount >= 20)
  );

  let badge: "BESTSELLER" | "HOT" | "NEW" | "SALE" | "" = "";
  if (item.badge) {
    badge = item.badge;
  } else if (isDeal) {
    badge = "SALE";
  } else if (isFeatured) {
    badge = "HOT";
  } else if (isBestSeller) {
    badge = "BESTSELLER";
  }

  const discountPercentage = rawDiscountPct > 0
    ? rawDiscountPct
    : (originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : undefined);

  return {
    id: String(item.id ?? item.slug),
    title: item.title || item.name || "Product",
    slug: item.slug || String(item.id),
    category: categorySlug,
    categoryName,
    subCategory: item.subCategory || categoryName,
    price,
    originalPrice,
    rating,
    reviewsCount,
    badge,
    discountPercentage,
    isFeatured,
    isBestSeller,
    isDealOfTheDay: isDeal,
    deliveryInfo: item.deliveryInfo || "Free Express Shipping",
    isAssured: item.isAssured !== false,
    image: primaryImage,
    galleryImages,
    description: item.description || "",
    specifications: Array.isArray(item.specifications) && item.specifications.length > 0
      ? item.specifications
      : ["Official Brand Warranty", "Verified Authentic Product", "30-Day Hassle-Free Returns"],
    stock: Number(item.stock ?? (item.in_stock ? 50 : 0)),
    brand: item.brand || "Al-Umaima",
    colors: item.colors || ["#000000", "#ffffff"],
    soldCount: item.soldCount || (reviewsCount * 3),
    reviews: item.reviews || [],
  };
}

/**
 * Fetch products with optional filters, search, sorting, and pagination.
 * Connects to Django GET /api/products/
 */
export async function getProducts(
  params: ProductQueryParams = {}
): Promise<PaginatedProductsResponse> {
  try {
    const res = await api.get("/api/products/", { params });
    const rawItems = extractResults(res);
    const mapped = rawItems.map(mapDjangoProductToFrontendProduct);
    const count = typeof res?.count === "number" ? res.count : mapped.length;

    return {
      count,
      next: res?.next || null,
      previous: res?.previous || null,
      results: mapped,
    };
  } catch (error) {
    console.warn("[getProducts] API request failed, using catalog fallback:", error);
    // Safe graceful fallback to avoid breaking static export / offline state
    return {
      count: products.length,
      next: null,
      previous: null,
      results: products,
    };
  }
}

/**
 * Convenient helper to get an array of products.
 */
export async function getAllProducts(
  params: ProductQueryParams = {}
): Promise<Product[]> {
  const resp = await getProducts(params);
  return resp.results;
}

/**
 * Fetch a single product by slug or ID from Django GET /api/products/{slug}/
 */
export async function getProductBySlug(
  slugOrId: string
): Promise<Product | null> {
  if (!slugOrId) return null;

  try {
    const cleanSlug = encodeURIComponent(slugOrId);
    const res = await api.get(`/api/products/${cleanSlug}/`);
    if (res && (res.id || res.slug || res.name || res.title)) {
      return mapDjangoProductToFrontendProduct(res);
    }
  } catch (error) {
    console.warn(`[getProductBySlug] API request failed for ${slugOrId}:`, error);
  }

  // Fallback to static catalog data
  const decoded = decodeURIComponent(slugOrId);
  const fallback = products.find(
    (p) => p.slug === decoded || p.id === decoded || p.slug === slugOrId || p.id === slugOrId
  );
  return fallback || null;
}

/**
 * Fetch featured products.
 * Tries Django GET /api/products/featured/ and falls back to GET /api/products/?featured=true
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    let res: any;
    try {
      res = await api.get("/api/products/featured/");
    } catch {
      res = await api.get("/api/products/", { params: { featured: "true" } });
    }

    const raw = extractResults(res);
    if (raw.length > 0) {
      return raw.map(mapDjangoProductToFrontendProduct);
    }
  } catch (error) {
    console.warn("[getFeaturedProducts] API request failed, using catalog fallback:", error);
  }

  return products.filter((p) => p.isFeatured || p.id.startsWith("feat"));
}

/**
 * Fetch deal products.
 * Tries Django GET /api/products/deals/ and falls back to GET /api/products/?deal=true
 */
export async function getDeals(): Promise<Product[]> {
  try {
    let res: any;
    try {
      res = await api.get("/api/products/deals/");
    } catch {
      res = await api.get("/api/products/", { params: { deal: "true" } });
    }

    const raw = extractResults(res);
    if (raw.length > 0) {
      return raw.map(mapDjangoProductToFrontendProduct);
    }
  } catch (error) {
    console.warn("[getDeals] API request failed, using catalog fallback:", error);
  }

  return products.filter(
    (p) => p.isDealOfTheDay || (p.discountPercentage && p.discountPercentage > 0) || p.badge === "SALE"
  );
}

/**
 * Search products using Django GET /api/search/?q=
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    let res: any;
    try {
      res = await api.get("/api/search/", { params: { q: trimmed } });
    } catch {
      res = await api.get("/api/products/", { params: { search: trimmed } });
    }

    const raw = extractResults(res);
    if (raw.length > 0) {
      return raw.map(mapDjangoProductToFrontendProduct);
    }
  } catch (error) {
    console.warn(`[searchProducts] API request failed for "${query}":`, error);
  }

  // Fallback to local client search
  const q = trimmed.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

/**
 * Fetch best sellers.
 * Uses Django ordering=-rating or client fallback.
 */
export async function getBestSellers(): Promise<Product[]> {
  try {
    const res = await api.get("/api/products/", { params: { ordering: "-rating", page_size: 10 } });
    const raw = extractResults(res);
    if (raw.length > 0) {
      return raw.map(mapDjangoProductToFrontendProduct);
    }
  } catch (error) {
    console.warn("[getBestSellers] API request failed, using catalog fallback:", error);
  }

  return products.filter((p) => p.isBestSeller);
}

/**
 * Fetch trending products for category tabs.
 */
export async function getTrendingProducts(categoryFilter?: string): Promise<Product[]> {
  try {
    const params: ProductQueryParams = { ordering: "-rating", page_size: 8 };

    if (categoryFilter && categoryFilter !== "All Items" && categoryFilter !== "All" && categoryFilter !== "all") {
      if (categoryFilter === "Offers") {
        params.deal = "true";
      } else if (categoryFilter === "Electronics") {
        params.category = "electronics";
      } else if (categoryFilter === "Fashion") {
        params.category = "fashion";
      } else if (categoryFilter === "Home") {
        params.category = "home-kitchen";
      } else if (categoryFilter === "Beauty") {
        params.category = "beauty";
      } else {
        params.category = categoryFilter.toLowerCase();
      }
    }

    const res = await api.get("/api/products/", { params });
    const raw = extractResults(res);
    if (raw.length > 0) {
      return raw.map(mapDjangoProductToFrontendProduct);
    }
  } catch (error) {
    console.warn("[getTrendingProducts] API request failed, using catalog fallback:", error);
  }

  // Fallback to mock catalog
  let filtered = products;
  if (categoryFilter === "Electronics") {
    filtered = products.filter((p) => p.category === "electronics");
  } else if (categoryFilter === "Fashion") {
    filtered = products.filter((p) => p.category === "fashion");
  } else if (categoryFilter === "Home") {
    filtered = products.filter((p) => p.category === "home-goods" || p.category === "home-living");
  } else if (categoryFilter === "Beauty") {
    filtered = products.filter((p) => p.category === "beauty" || p.category === "accessories");
  } else if (categoryFilter === "Offers") {
    filtered = products.filter((p) => (p.discountPercentage && p.discountPercentage > 0) || p.badge === "SALE" || p.isFeatured);
  }

  return [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 8);
}
