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
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const karat = searchParams.get("karat") || "";
    const status = searchParams.get("status") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15")));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.categoryId = category;
    if (karat) where.karat = karat;
    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;
    if (status === "lowStock") where.stock = { lte: 5 };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { images: { take: 1, orderBy: { order: "asc" } }, category: true, _count: { select: { orderItems: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, nameAr, nameFr, slug, description, descriptionFr, karat, weight, profitMargin, categoryId, images, isFeatured, isNew, certification, stock, videoUrl } = body;

    if (!name || !karat || !weight) {
      return NextResponse.json({ error: "Name, karat, and weight are required" }, { status: 400 });
    }

    const goldPrice = await db.goldPrice.findFirst({ where: { karat, isActive: true }, orderBy: { createdAt: "desc" } });
    const goldPriceValue = goldPrice?.price || 0;
    const calculatedPrice = (Number(goldPriceValue) + (profitMargin || 0)) * weight;
    const sku = `FA-${karat}-${Date.now()}`;

    const product = await db.product.create({
      data: {
        name,
        nameAr: nameAr || name,
        nameFr: nameFr || name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description,
        descriptionFr: descriptionFr || description,
        sku,
        karat,
        weight,
        profitMargin: profitMargin || 0,
        calculatedPrice,
        goldPrice: goldPriceValue,
        stock: stock || 10,
        isFeatured: isFeatured || false,
        isNew: isNew !== false,
        certification: certification || null,
        videoUrl: videoUrl || null,
        category: categoryId ? { connect: { id: categoryId } } : undefined as any,
        images: images?.length ? { create: images.map((img: any) => ({ url: typeof img === "string" ? img : img.url, alt: typeof img === "string" ? name : (img.alt || name) })) } : undefined,
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, images, ...data } = body;
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    // Recalculate price if weight or profitMargin or karat changed
    if (data.weight || data.profitMargin || data.karat) {
      const product = await db.product.findUnique({ where: { id }, select: { karat: true, weight: true, profitMargin: true } });
      if (product) {
        const karat = data.karat || product.karat;
        const weight = data.weight || product.weight;
        const profitMargin = data.profitMargin ?? product.profitMargin;
        const goldPrice = await db.goldPrice.findFirst({ where: { karat, isActive: true }, orderBy: { createdAt: "desc" } });
        data.goldPrice = goldPrice?.price || 0;
        data.calculatedPrice = (Number(data.goldPrice) + profitMargin) * weight;
      }
    }

    if (images) {
      await db.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        data.images = { create: images.map((img: any) => ({ url: typeof img === "string" ? img : img.url, alt: typeof img === "string" ? "" : (img.alt || "") })) };
      }
    }

    const product = await db.product.update({ where: { id }, data, include: { images: true, category: true } });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    await db.productImage.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
