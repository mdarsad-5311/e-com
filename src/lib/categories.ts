import { api, getBaseApiUrl } from "@/lib/api";
import { Category, categories, Product } from "@/data/products";
import { mapDjangoProductToFrontendProduct } from "@/lib/products";

export interface CategoryWithProducts {
  category: Category;
  products: Product[];
}

/**
 * Safely extracts items from either an array response or paginated results.
 */
function extractCategoryList(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.data)) return response.data;
  return [];
}

/**
 * Format category image URL.
 */
export function formatCategoryImageUrl(imgUrl?: string | null): string {
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
 * Map Django CategorySerializer response to frontend Category shape.
 */
export function mapDjangoCategoryToFrontendCategory(item: any): Category {
  if (!item) {
    return {} as Category;
  }

  const slug = item.slug || String(item.id || "category");
  const name = item.name || slug;

  // Derive icon according to category context
  let icon: "Smartphone" | "Monitor" | "Shirt" | "Home" | "Sparkles" | "Headphones" | "Watch" = "Monitor";
  const s = `${slug} ${name}`.toLowerCase();

  if (s.includes("phone") || s.includes("mobile")) {
    icon = "Smartphone";
  } else if (s.includes("fashion") || s.includes("cloth") || s.includes("apparel") || s.includes("wear")) {
    icon = "Shirt";
  } else if (s.includes("home") || s.includes("kitchen") || s.includes("living") || s.includes("decor")) {
    icon = "Home";
  } else if (s.includes("beauty") || s.includes("personal") || s.includes("fragrance") || s.includes("cosmetic")) {
    icon = "Sparkles";
  } else if (s.includes("audio") || s.includes("headphone") || s.includes("sound")) {
    icon = "Headphones";
  } else if (s.includes("watch") || s.includes("sport") || s.includes("fitness")) {
    icon = "Watch";
  } else if (s.includes("tech") || s.includes("electronic") || s.includes("laptop") || s.includes("computer")) {
    icon = "Monitor";
  }

  return {
    id: String(item.id || slug),
    name,
    slug,
    icon,
    description: item.description || `Discover curated ${name} selections at Al-Umaima.`,
    itemCount: Number(item.itemCount ?? (Array.isArray(item.products) ? item.products.length : 24)),
    image: formatCategoryImageUrl(item.image),
  };
}

/**
 * Fetch all categories from Django GET /api/categories/
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await api.get("/api/categories/");
    const raw = extractCategoryList(res);
    if (raw.length > 0) {
      return raw.map(mapDjangoCategoryToFrontendCategory);
    }
  } catch (error) {
    console.warn("[getCategories] API request failed, using catalog fallback:", error);
  }

  return categories;
}

/**
 * Fetch category detail by slug from Django GET /api/categories/{slug}/
 * Also returns the active products belonging to the category.
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryWithProducts | null> {
  if (!slug) return null;

  try {
    const cleanSlug = encodeURIComponent(slug);
    const res = await api.get(`/api/categories/${cleanSlug}/`);
    if (res && (res.id || res.slug || res.name)) {
      const category = mapDjangoCategoryToFrontendCategory(res);
      const rawProducts = Array.isArray(res.products) ? res.products : [];
      const mappedProducts = rawProducts.map(mapDjangoProductToFrontendProduct);

      return {
        category,
        products: mappedProducts,
      };
    }
  } catch (error) {
    console.warn(`[getCategoryBySlug] API request failed for ${slug}:`, error);
  }

  // Fallback to static data
  const fallbackCat = categories.find((c) => c.slug === slug);
  if (!fallbackCat) return null;

  return {
    category: fallbackCat,
    products: [],
  };
}
