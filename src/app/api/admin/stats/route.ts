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

    const [revenueResult, ordersCount, productsCount, customersCount] =
      await Promise.all([
        db.order.aggregate({
          _sum: { total: true },
          where: { status: { not: "CANCELLED" } },
        }),
        db.order.count(),
        db.product.count({ where: { isActive: true } }),
        db.user.count({ where: { role: "CUSTOMER" } }),
      ]);

    return NextResponse.json({
      revenue: revenueResult._sum.total || 0,
      orders: ordersCount,
      products: productsCount,
      customers: customersCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
