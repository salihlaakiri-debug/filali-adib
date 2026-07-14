import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
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
        const raw = await db.$queryRaw<{ date: string; revenue: number; orders: number }[]>`
          SELECT
            TO_CHAR(o."createdAt"::date, 'YYYY-MM-DD') AS date,
            COALESCE(SUM(o."total"), 0)::float AS revenue,
            COUNT(o."id")::int AS orders
          FROM "Order" o
          WHERE o."status" != 'CANCELLED'
            AND o."createdAt" >= ${startDate}
          GROUP BY o."createdAt"::date
          ORDER BY date ASC
        `;
        const map = new Map(raw.map((r) => [r.date, { date: r.date, revenue: Number(r.revenue), orders: r.orders }]));
        const results: { date: string; revenue: number; orders: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const key = d.toISOString().split("T")[0];
          results.push(map.get(key) || { date: key, revenue: 0, orders: 0 });
        }
        return results;
      })(),

      db.$queryRaw<{ name: string; sales: number; revenue: number; image: string | null }[]>`
        SELECT
          p."name" AS name,
          SUM(oi."quantity")::int AS sales,
          SUM(oi."total")::float AS revenue,
          (SELECT pi."url" FROM "ProductImage" pi WHERE pi."productId" = p."id" ORDER BY pi."order" LIMIT 1) AS image
        FROM "OrderItem" oi
        JOIN "Order" o ON oi."orderId" = o."id"
        JOIN "Product" p ON oi."productId" = p."id"
        WHERE o."status" != 'CANCELLED'
          AND o."createdAt" >= ${startDate}
        GROUP BY p."id", p."name"
        ORDER BY revenue DESC
        LIMIT 10
      `,

      db.$queryRaw<{ name: string; revenue: number; sales: number }[]>`
        SELECT
          c."name" AS name,
          SUM(oi."total")::float AS revenue,
          SUM(oi."quantity")::int AS sales
        FROM "OrderItem" oi
        JOIN "Order" o ON oi."orderId" = o."id"
        JOIN "Product" p ON oi."productId" = p."id"
        JOIN "Category" c ON p."categoryId" = c."id"
        WHERE o."status" != 'CANCELLED'
          AND o."createdAt" >= ${startDate}
        GROUP BY c."id", c."name"
        HAVING SUM(oi."quantity") > 0
        ORDER BY revenue DESC
      `,

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
