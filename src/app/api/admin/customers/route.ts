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
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "15"));
    const skip = (page - 1) * limit;

    const where: any = { role: "CUSTOMER" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    const [customers, total] = await Promise.all([
      db.user.findMany({
        where, skip, take: limit,
        select: {
          id: true, name: true, email: true, phone: true, createdAt: true,
          _count: { select: { orders: true } },
          orders: { select: { total: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count({ where }),
    ]);

    const customersWithTotal = customers.map((c) => ({
      ...c,
      totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
      orderCount: c._count.orders,
      orders: undefined, _count: undefined,
    }));

    return NextResponse.json({
      customers: customersWithTotal,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
