import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!db) return NextResponse.json({ reviews: [], total: 0, average: 0 });
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ reviews: [], total: 0, average: 0 });

    const reviews = await db.review.findMany({
      where: { productId, isApproved: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total : 0;

    return NextResponse.json({ reviews, total, average: Math.round(average * 10) / 10 });
  } catch (e) {
    console.error("Error fetching reviews:", e);
    return NextResponse.json({ reviews: [], total: 0, average: 0 });
  }
}

export async function POST(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, rating, comment } = await request.json();
    if (!productId || !rating) return NextResponse.json({ error: "productId and rating required" }, { status: 400 });

    const review = await db.review.create({
      data: {
        userId: session.user!.id,
        productId,
        rating: Math.min(5, Math.max(1, rating)),
        comment: comment || "",
        isApproved: true,
      },
    });

    return NextResponse.json({ review });
  } catch (e) {
    console.error("Error creating review:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
