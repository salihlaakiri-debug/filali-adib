import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goldPrices = await db.goldPrice.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      distinct: ["karat"],
    });

    return NextResponse.json({ goldPrices });
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch gold prices" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { karat, price } = body;

    if (!karat || !price) {
      return NextResponse.json(
        { error: "Karat and price are required" },
        { status: 400 }
      );
    }

    // Deactivate old prices for this karat
    await db.goldPrice.updateMany({
      where: { karat, isActive: true },
      data: { isActive: false },
    });

    // Create new price
    const newPrice = await db.goldPrice.create({
      data: {
        karat,
        price,
        currency: "MAD",
        isActive: true,
      },
    });

    return NextResponse.json({ goldPrice: newPrice });
  } catch (error) {
    console.error("Error updating gold price:", error);
    return NextResponse.json(
      { error: "Failed to update gold price" },
      { status: 500 }
    );
  }
}
