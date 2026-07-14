import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [goldPrices, margins, categories] = await Promise.all([
      db.goldPrice.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, distinct: ["karat"] }),
      db.profitMargin.findMany({ where: { isActive: true } }),
      db.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    ]);

    return NextResponse.json({ goldPrices, margins, categories });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json({ error: "Failed to fetch pricing" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, karat, price, prices, margins } = body;

    // Update gold price(s)
    if (type === "goldPrice" && prices && Array.isArray(prices)) {
      for (const p of prices) {
        if (p.karat && p.price) {
          await db.goldPrice.updateMany({ where: { karat: p.karat, isActive: true }, data: { isActive: false } });
          await db.goldPrice.create({ data: { karat: p.karat, price: p.price, currency: "MAD", isActive: true } });
        }
      }
      return NextResponse.json({ success: true });
    }

    // Legacy single karat support
    if (type === "goldPrice" && karat && price) {
      await db.goldPrice.updateMany({ where: { karat, isActive: true }, data: { isActive: false } });
      const newPrice = await db.goldPrice.create({ data: { karat, price, currency: "MAD", isActive: true } });
      return NextResponse.json({ goldPrice: newPrice });
    }

    // Update margins
    if (type === "margins" && margins) {
      for (const m of margins) {
        if (m.id) {
          await db.profitMargin.update({ where: { id: m.id }, data: { margin: m.margin } });
        } else {
          const existing = await db.profitMargin.findFirst({ where: { categoryId: m.categoryId, productId: m.productId || null, isActive: true } });
          if (existing) {
            await db.profitMargin.update({ where: { id: existing.id }, data: { margin: m.margin } });
          } else {
            await db.profitMargin.create({ data: { categoryId: m.categoryId, productId: m.productId || null, margin: m.margin, isActive: true } });
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating pricing:", error);
    return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
  }
}
