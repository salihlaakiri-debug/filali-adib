import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

let storeSettings: Record<string, any> = {
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
  return NextResponse.json({ settings: storeSettings });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    storeSettings = { ...storeSettings, ...body };
    return NextResponse.json({ settings: storeSettings });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
