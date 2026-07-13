import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  if (!db) {
    return NextResponse.json({ products: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } });
  }
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const karat = searchParams.get("karat");
    const slug = searchParams.get("slug");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: any = {
      isActive: true,
    };

    if (slug) {
      where.slug = slug;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (karat) {
      where.karat = karat;
    }

    const orderBy: any = (() => {
      switch (sort) {
        case "priceLow":
          return { calculatedPrice: "asc" };
        case "priceHigh":
          return { calculatedPrice: "desc" };
        default:
          return { createdAt: "desc" };
      }
    })();

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: true,
          category: true,
        },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: String(error) },
      { status: 500 }
    );
  }
}
