import { NextResponse } from "next/server";
import { categories } from "@/data/products";

export async function GET() {
  return NextResponse.json({ success: true, count: categories.length, data: categories });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCat = {
      id: body.id || (body.name || "category").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: body.name || "New Category",
      slug: (body.name || "new-category").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: body.icon || "Headphones",
      description: body.description || "Category description",
      itemCount: Number(body.itemCount) || 0,
      image: body.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    };

    categories.push(newCat as any);
    return NextResponse.json({ success: true, message: "Category created successfully", data: newCat }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
