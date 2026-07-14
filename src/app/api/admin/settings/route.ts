import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const defaults = {
  storeName: "Filali Adib - Artiste Joaillier",
  storeEmail: "contact@filaliadib.com",
  storePhone: "+212 522-123456",
  currency: "MAD",
  shippingLocal: 150,
  freeShippingAbove: 5000,
  shippingInternational: 500,
  minInternationalOrder: 10000,
  taxRate: 20,
  taxId: "12345678",
};

export async function GET() {
  try {
    if (!db) return NextResponse.json({ settings: defaults });
    let settings = await db.storeSettings.findUnique({ where: { id: "default" } });
    if (!settings) {
      settings = await db.storeSettings.create({ data: { id: "default", ...defaults } });
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: defaults });
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
    const settings = await db.storeSettings.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...defaults, ...body },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
