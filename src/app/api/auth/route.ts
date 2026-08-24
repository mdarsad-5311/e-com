import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: "usr-101",
          name: email.split("@")[0] || "Al-Umaima Customer",
          email: email,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          phone: "+91 98765 43210",
        },
        token: "mock-jwt-token-123456789",
      });
    }

    if (action === "register") {
      return NextResponse.json({
        success: true,
        user: {
          id: `usr-${Date.now()}`,
          name: name || "New User",
          email: email,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        },
        token: `mock-jwt-token-${Date.now()}`,
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
