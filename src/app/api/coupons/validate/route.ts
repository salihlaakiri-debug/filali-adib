import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "الكوبون مطلوب" }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      return NextResponse.json({ error: "الكوبون غير صحيح" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "الكوبون غير نشط" }, { status: 400 });
    }

    const now = new Date();
    if (now < coupon.startsAt) {
      return NextResponse.json({ error: "الكوبون لم يبدأ بعد" }, { status: 400 });
    }
    if (now > coupon.expiresAt) {
      return NextResponse.json({ error: "الكوبون منتهي الصلاحية" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "الكوبون استُنفد" }, { status: 400 });
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return NextResponse.json({
        error: `الحد الأدنى للطلب ${coupon.minPurchase.toLocaleString()} د.م`,
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round(subtotal * (coupon.discountValue / 100));
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount,
    });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
