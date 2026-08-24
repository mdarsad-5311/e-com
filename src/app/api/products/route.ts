import { NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let filtered = [...products];

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (featured === "true") {
    filtered = filtered.filter((p) => p.isFeatured || p.isBestSeller);
  }

  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = {
      id: `prod-${Date.now()}`,
      title: body.title || "New Product",
      slug: (body.title || "new-product").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: body.category || "electronics",
      categoryName: body.categoryName || "Electronics",
      price: Number(body.price) || 99.99,
      originalPrice: Number(body.originalPrice) || 129.99,
      rating: 5.0,
      reviewsCount: 0,
      badge: body.badge || "NEW",
      isFeatured: body.isFeatured ?? true,
      isBestSeller: false,
      image: body.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      description: body.description || "High performance e-commerce item.",
      specifications: body.specifications || ["Premium Build", "Warranty Included"],
      stock: Number(body.stock) || 50,
      brand: body.brand || "Al-Umaima",
    };

    products.unshift(newProduct);
    return NextResponse.json({ success: true, message: "Product created successfully", data: newProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
