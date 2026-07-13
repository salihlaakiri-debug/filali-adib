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

    const totalOrders = await db.order.count();
    const totalProducts = await db.product.count();
    const totalCustomers = await db.user.count({ where: { role: "CUSTOMER" } });
    const totalRevenue = await db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } });

    const allOrders = await db.order.findMany({
      include: { items: { include: { product: { include: { images: true } } } } },
      where: { status: { not: "CANCELLED" } },
    });

    // Calculate top products
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        const pid = item.productId;
        if (!productSales[pid]) productSales[pid] = { name: item.product.name, sales: 0, revenue: 0 };
        productSales[pid].sales += item.quantity;
        productSales[pid].revenue += item.total;
      });
    });
    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

    // Last 30 days sales
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = allOrders.filter((o) => new Date(o.createdAt) >= thirtyDaysAgo);
    const recentRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
    const recentCount = recentOrders.length;
    const avgOrder = recentCount > 0 ? Math.round(recentRevenue / recentCount) : 0;
    const conversionRate = totalCustomers > 0 ? ((recentCount / totalCustomers) * 100).toFixed(1) : "0";

    return NextResponse.json({
      metrics: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalProducts,
        totalCustomers,
        recentRevenue,
        recentCount,
        avgOrder,
        conversionRate,
      },
      topProducts,
    });
  } catch {
    return NextResponse.json({ metrics: {}, topProducts: [] });
  }
}
