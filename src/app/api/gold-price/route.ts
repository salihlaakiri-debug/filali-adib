import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let price24k = 1500;

  // Try to read from database (set via admin panel)
  try {
    if (db) {
      const goldPrice = await db.goldPrice.findFirst({
        where: { karat: "K24", isActive: true },
        orderBy: { createdAt: "desc" },
      });
      if (goldPrice) {
        price24k = goldPrice.price;
      }
    }
  } catch {}

  // If we have a Metals API key, try to get live price
  if (process.env.METALS_API_KEY) {
    try {
      const res = await fetch(
        `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=XAU&symbols=MAD`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.rates?.MAD) {
          price24k = Math.round((1 / data.rates.MAD) * 1000) || price24k;
        }
      }
    } catch {}
  }

  return NextResponse.json({
    price24k,
    price21k: Math.round(price24k * 0.875),
    price18k: Math.round(price24k * 0.75),
    currency: "MAD",
    updatedAt: new Date().toISOString(),
    source: process.env.METALS_API_KEY ? "metals-api" : "database",
  });
}
