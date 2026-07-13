import { NextResponse } from "next/server";

const FALLBACK_PRICES = { price24k: 1500, price21k: 1300, price18k: 1100 };

async function fetchLivePrice(): Promise<typeof FALLBACK_PRICES> {
  try {
    const res = await fetch(
      "https://metals-api.com/api/latest?access_key=" + (process.env.METALS_API_KEY || "") + "&base=XAU&symbols=MAD",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return FALLBACK_PRICES;
    const data = await res.json();
    if (data.rates?.MAD) {
      const xauToMAD = data.rates.MAD;
      const price24k = Math.round((1 / xauToMAD) * 1000) || FALLBACK_PRICES.price24k;
      return {
        price24k,
        price21k: Math.round(price24k * 0.875),
        price18k: Math.round(price24k * 0.75),
      };
    }
    return FALLBACK_PRICES;
  } catch {
    return FALLBACK_PRICES;
  }
}

export async function GET() {
  const prices = await fetchLivePrice();
  return NextResponse.json({
    ...prices,
    currency: "MAD",
    updatedAt: new Date().toISOString(),
    source: process.env.METALS_API_KEY ? "metals-api" : "fallback",
  });
}
