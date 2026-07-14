import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let price18k = 1100;

  try {
    if (db) {
      const goldPrice = await db.goldPrice.findFirst({
        where: { karat: "K18", isActive: true },
        orderBy: { createdAt: "desc" },
      });
      if (goldPrice) {
        price18k = goldPrice.price;
      }
    }
    } catch (e) {
      console.warn("Metals API fallback:", (e as Error).message);
    }

  if (process.env.METALS_API_KEY) {
    try {
      const res = await fetch(
        `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=XAU&symbols=MAD`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.rates?.MAD) {
          const price24k = Math.round((1 / data.rates.MAD) * 1000) || 1500;
          price18k = Math.round(price24k * 0.75);
        }
      }
  } catch (e) {
    console.warn("Gold price DB fallback:", (e as Error).message);
  }
  }

  return NextResponse.json({
    price18k,
    pricePerGram: price18k,
    currency: "MAD",
    updatedAt: new Date().toISOString(),
    source: process.env.METALS_API_KEY ? "metals-api" : "database",
    change: 0,
    changePercent: 0,
  });
}
