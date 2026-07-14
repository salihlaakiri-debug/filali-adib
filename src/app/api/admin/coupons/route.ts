import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ coupons });
  } catch (e) {
    console.error("Error fetching coupons:", e);
    return NextResponse.json({ coupons: [] });
  }
}

export async function POST(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { code, description, discountType, discountValue, minPurchase, maxDiscount, usageLimit, startsAt, expiresAt } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) return NextResponse.json({ error: "Code already exists" }, { status: 400 });

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase(), description, discountType, discountValue,
        minPurchase: minPurchase || null, maxDiscount: maxDiscount || null,
        usageLimit: usageLimit || null, isActive: true,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (e) {
    console.error("Error creating coupon:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (data.code) data.code = data.code.toUpperCase();
    if (data.startsAt) data.startsAt = new Date(data.startsAt);
    if (data.expiresAt) data.expiresAt = new Date(data.expiresAt);

    const coupon = await db.coupon.update({ where: { id }, data });
    return NextResponse.json({ coupon });
  } catch (e) {
    console.error("Error updating coupon:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Error deleting coupon:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
