import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  if (!db) return NextResponse.json({ categories: [] });
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
