import { NextResponse } from "next/server";
import { mockOrders } from "@/data/orders";

export async function GET() {
  return NextResponse.json({ success: true, count: mockOrders.length, data: mockOrders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Processing",
      totalAmount: Number(body.totalAmount) || 99.99,
      itemsCount: body.items?.length || 1,
      trackingNumber: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      items: body.items || [],
      shippingAddress: body.shippingAddress || "124 Tech Boulevard, Bengaluru",
      paymentMethod: body.paymentMethod || "Credit Card"
    };

    mockOrders.unshift(newOrder);
    return NextResponse.json({ success: true, message: "Order placed successfully", data: newOrder }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
