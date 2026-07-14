import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorites = await db.favorite.findMany({
      where: { userId: session.user!.id },
      include: { product: { include: { images: true, category: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites });
  } catch (e) {
    console.error("Error fetching favorites:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    const existing = await db.favorite.findUnique({
      where: { userId_productId: { userId: session.user!.id, productId } },
    });

    if (existing) {
      await db.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ added: false });
    }

    await db.favorite.create({
      data: { userId: session.user!.id, productId },
    });

    return NextResponse.json({ added: true });
  } catch (e) {
    console.error("Error toggling favorite:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
