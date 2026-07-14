import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ shippingMethods: [] });
    const shippingMethods = await db.shippingMethod.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ shippingMethods });
  } catch (e) {
    console.error("Error fetching shipping methods:", e);
    return NextResponse.json({ shippingMethods: [] });
  }
}

export async function POST(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { name, nameAr, description, price, freeAbove, estimatedDays, order } = body;
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const maxOrder = await db.shippingMethod.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
    const method = await db.shippingMethod.create({
      data: { name, nameAr: nameAr || name, description, price: price || 0, freeAbove: freeAbove || null, estimatedDays: estimatedDays || null, order: order ?? ((maxOrder?.order || 0) + 1) },
    });
    return NextResponse.json({ method }, { status: 201 });
  } catch (e) {
    console.error("Error creating shipping method:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
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
    const { id, name, nameAr, description, price, freeAbove, estimatedDays, order, isActive } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (nameAr !== undefined) data.nameAr = nameAr;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (freeAbove !== undefined) data.freeAbove = freeAbove;
    if (estimatedDays !== undefined) data.estimatedDays = estimatedDays;
    if (order !== undefined) data.order = order;
    if (isActive !== undefined) data.isActive = isActive;
    const method = await db.shippingMethod.update({ where: { id }, data });
    return NextResponse.json({ method });
  } catch (e) {
    console.error("Error updating shipping method:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.shippingMethod.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting shipping method:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
