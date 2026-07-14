import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(90, Math.max(7, parseInt(searchParams.get("days") || "30")));

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      totalRevenue,
      ordersByStatus,
      dailyRevenue,
      topProducts,
      topCategories,
      recentOrders,
      lowStockProducts,
      ordersByPaymentMethod,
    ] = await Promise.all([
      db.order.count({ where: { createdAt: { gte: startDate } } }),
      db.product.count({ where: { isActive: true } }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" }, createdAt: { gte: startDate } } }),

      db.order.groupBy({
        by: ["status"],
        _count: { id: true },
        _sum: { total: true },
        where: { createdAt: { gte: startDate } },
      }),

      (async () => {
        const results: { date: string; revenue: number; orders: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
          const dayStart = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
          const dayEnd = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const [dayRevenue, dayOrders] = await Promise.all([
            db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" }, createdAt: { gte: dayStart, lt: dayEnd } } }),
            db.order.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
          ]);
          results.push({
            date: dayStart.toISOString().split("T")[0],
            revenue: Number(dayRevenue._sum.total || 0),
            orders: dayOrders,
          });
        }
        return results;
      })(),

      (async () => {
        const orders = await db.order.findMany({
          where: { status: { not: "CANCELLED" }, createdAt: { gte: startDate } },
          include: { items: { include: { product: true } } },
        });
        const sales: Record<string, { name: string; sales: number; revenue: number; image: string | null }> = {};
        orders.forEach((o) => o.items.forEach((item) => {
          const pid = item.productId;
          if (!sales[pid]) sales[pid] = { name: item.product.name, sales: 0, revenue: 0, image: null };
          sales[pid].sales += item.quantity;
          sales[pid].revenue += Number(item.total);
        }));
        return Object.values(sales).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
      })(),

      (async () => {
        const categories = await db.category.findMany({ select: { id: true, name: true } });
        const categoryResults: { name: string; revenue: number; sales: number }[] = [];
        for (const cat of categories) {
          const catOrders = await db.orderItem.findMany({
            where: {
              product: { categoryId: cat.id },
              order: { status: { not: "CANCELLED" }, createdAt: { gte: startDate } },
            },
            select: { quantity: true, total: true },
          });
          const revenue = catOrders.reduce((s, oi) => s + Number(oi.total), 0);
          const sales = catOrders.reduce((s, oi) => s + oi.quantity, 0);
          if (sales > 0) categoryResults.push({ name: cat.name, revenue, sales });
        }
        return categoryResults.sort((a, b) => b.revenue - a.revenue);
      })(),

      db.order.findMany({
        take: 10,
        include: { user: { select: { name: true, email: true } }, items: { select: { quantity: true } } },
        orderBy: { createdAt: "desc" },
      }),

      db.product.findMany({
        where: { stock: { lte: 5 }, isActive: true },
        select: { id: true, name: true, stock: true, karat: true, images: { take: 1 } },
        orderBy: { stock: "asc" },
        take: 10,
      }),

      db.payment.groupBy({
        by: ["method"],
        _count: { id: true },
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }).catch(() => []),
    ]);

    const activeOrders = ordersByStatus.find((s) => s.status === "PENDING")?._count.id || 0;

    return NextResponse.json({
      metrics: {
        revenue: Number(totalRevenue._sum.total || 0),
        orders: totalOrders,
        products: totalProducts,
        customers: totalCustomers,
        pendingOrders: activeOrders,
        avgOrderValue: totalOrders > 0 ? Math.round(Number(totalRevenue._sum.total || 0) / totalOrders) : 0,
      },
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
        total: Number(s._sum.total || 0),
      })),
      dailyRevenue,
      topProducts,
      topCategories,
      recentOrders,
      lowStockProducts,
      ordersByPaymentMethod: ordersByPaymentMethod.map((p) => ({
        method: p.method,
        count: p._count.id,
        total: Number(p._sum.amount || 0),
      })),
      period: { days, startDate: startDate.toISOString(), endDate: now.toISOString() },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
