import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [revenueResult, ordersCount, productsCount, customersCount, pendingOrders, pendingReviews, activeCoupons, lowStockProducts] =
      await Promise.all([
        db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
        db.order.count(),
        db.product.count({ where: { isActive: true } }),
        db.user.count({ where: { role: "CUSTOMER" } }),
        db.order.count({ where: { status: "PENDING" } }),
        db.review.count({ where: { isApproved: false } }),
        db.coupon.count({ where: { isActive: true } }),
        db.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
      ]);

    return NextResponse.json({
      revenue: revenueResult._sum.total || 0,
      orders: ordersCount,
      products: productsCount,
      customers: customersCount,
      pendingOrders,
      pendingReviews,
      activeCoupons,
      lowStockProducts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
