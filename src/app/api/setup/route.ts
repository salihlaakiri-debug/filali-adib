import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  if (!db) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL not configured. Add a PostgreSQL connection string to Vercel env vars." }, { status: 503 });
  }
  try {
    const existing = await db.user.findFirst();
    if (existing) {
      return NextResponse.json({ ok: true, message: "Already seeded" });
    }

    await seed();
    return NextResponse.json({ ok: true, message: "Seeded successfully" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Seed failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

async function seed() {
  if (!db) throw new Error("Database not available");
  const adminPassword = await bcrypt.hash("admin123", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  const admin = await db.user.create({
    data: {
      email: "admin@filaliadib.com",
      name: "عديب فيليالي",
      password: adminPassword,
      phone: "+212600000000",
      role: "ADMIN",
    },
  });

  await db.user.create({
    data: {
      email: "customer@example.com",
      name: "أحمد محمد",
      password: customerPassword,
      phone: "+212611111111",
      role: "CUSTOMER",
    },
  });

  const rings = await db.category.create({
    data: { name: "خواتم", nameAr: "خواتم", nameFr: "Bagues", slug: "rings", description: "خواتم زواج ومغناطيسية", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80", order: 1 },
  });
  const necklaces = await db.category.create({
    data: { name: "سلاسل", nameAr: "سلاسل", nameFr: "Colliers", slug: "necklaces", description: "سلاسل وقلادات ذهبية", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80", order: 2 },
  });
  const earrings = await db.category.create({
    data: { name: "أقراط", nameAr: "أقراط", nameFr: "Boucles d'oreilles", slug: "earrings", description: "أقراط ذهبية متنوعة", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", order: 3 },
  });
  const bracelets = await db.category.create({
    data: { name: "أساور", nameAr: "أساور", nameFr: "Bracelets", slug: "bracelets", description: "أساور ذهبية", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80", order: 4 },
  });
  const sets = await db.category.create({
    data: { name: "أطقم", nameAr: "أطقم", nameFr: "Parures", slug: "sets", description: "أطقم مجوهرات كاملة", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80", order: 5 },
  });

  await db.goldPrice.create({ data: { karat: "K18", price: 1100, currency: "MAD", source: "manual", isActive: true } });

  await db.profitMargin.create({ data: { categoryId: rings.id, margin: 200, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: necklaces.id, margin: 250, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: earrings.id, margin: 180, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: bracelets.id, margin: 220, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: sets.id, margin: 300, isActive: true } });

  const productsData = [
    { name: "خاتم زواج ذهبي عيار 18", nameFr: "Bague de mariage en or 18 carats", slug: "gold-wedding-ring-18k", description: "خاتم زواج فاخر من الذهب عيار 18، صُنع يدوياً بحرفية عالية.", descriptionFr: "Bague de mariage de luxe en or 18 carats.", sku: "FA-RNG-001", karat: "K18", weight: 5, goldPrice: 1100, profitMargin: 200, calculatedPrice: 6500, stock: 10, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: rings.id },
    { name: "قلادة ذهبية عيار 18", nameFr: "Collier en or 18 carats", slug: "gold-necklace-18k", description: "قلادة ذهبية عيار 18 بتصميم أنيق وعصري.", descriptionFr: "Collier élégant en or 18 carats.", sku: "FA-NCK-002", karat: "K18", weight: 10, goldPrice: 1100, profitMargin: 250, calculatedPrice: 13500, stock: 5, isFeatured: true, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id },
    { name: "أقراط ذهبية عيار 18", nameFr: "Boucles d'oreilles en or 18 carats", slug: "gold-earrings-18k", description: "أقراط ذهبية عيار 18 بتصميم راقي.", descriptionFr: "Boucles d'oreilles élégantes en or 18 carats.", sku: "FA-EAR-003", karat: "K18", weight: 3.5, goldPrice: 1100, profitMargin: 180, calculatedPrice: 4480, stock: 15, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: earrings.id },
    { name: "سوار ذهبي عيار 18", nameFr: "Bracelet en or 18 carats", slug: "gold-bracelet-18k", description: "سوار ذهبي عيار 18 عالي الجودة.", descriptionFr: "Bracelet en or 18 carats de haute qualité.", sku: "FA-BRC-004", karat: "K18", weight: 15, goldPrice: 1100, profitMargin: 220, calculatedPrice: 19800, stock: 3, isFeatured: true, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: bracelets.id },
    { name: "طقم ذهبي كامل عيار 18", nameFr: "Parure complète en or 18 carats", slug: "gold-set-18k", description: "طقم مجوهرات ذهبي كامل يشمل خاتم وقلادة وأقراط.", descriptionFr: "Parure complète en or 18 carats.", sku: "FA-SET-005", karat: "K18", weight: 25, goldPrice: 1100, profitMargin: 300, calculatedPrice: 35000, stock: 2, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: sets.id },
    { name: "خاتم ألماس ذهبي عيار 18", nameFr: "Bague diamant en or 18 carats", slug: "diamond-ring-18k", description: "خاتم ذهبي عيار 18 مرصع بألماس طبيعي فاخر.", descriptionFr: "Bague en or 18 carats sertie de diamants.", sku: "FA-RNG-006", karat: "K18", weight: 8, goldPrice: 1100, profitMargin: 500, calculatedPrice: 12800, stock: 4, isFeatured: false, isNew: false, certification: "شهادة ألماس معتمدة", categoryId: rings.id },
    { name: "سلاسل ذهبية عيار 18", nameFr: "Chaîne en or 18 carats", slug: "layered-necklace-18k", description: "قلادة سلاسل متعددة الطبقات من الذهب عيار 18.", descriptionFr: "Collier à chaînes superposées en or 18 carats.", sku: "FA-NCK-007", karat: "K18", weight: 12, goldPrice: 1100, profitMargin: 280, calculatedPrice: 16560, stock: 6, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id },
    { name: "أقراط لؤلؤ ذهبية عيار 18", nameFr: "Boucles d'oreilles perle en or 18 carats", slug: "pearl-earrings-18k", description: "أقراط ذهبية عيار 18 مع حبات لؤلؤ طبيعي.", descriptionFr: "Boucles d'oreilles en or 18 carats avec perles naturelles.", sku: "FA-EAR-008", karat: "K18", weight: 4, goldPrice: 1100, profitMargin: 220, calculatedPrice: 5280, stock: 8, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: earrings.id },
  ];

  const productImages: Record<string, string[]> = {
    "gold-wedding-ring-18k": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80", "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80"],
    "gold-necklace-18k": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"],
    "gold-earrings-18k": ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80", "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80"],
    "gold-bracelet-18k": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80"],
    "gold-set-18k": ["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"],
    "diamond-ring-18k": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80", "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80"],
    "layered-necklace-18k": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"],
    "pearl-earrings-18k": ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80"],
  };

  for (const pd of productsData) {
    const product = await db.product.create({ data: pd });
    const images = productImages[pd.slug] || [];
    for (let i = 0; i < images.length; i++) {
      await db.productImage.create({
        data: { url: images[i], alt: product.name, order: i, productId: product.id },
      });
    }
  }

  await db.coupon.create({
    data: { code: "WELCOME10", description: "خصم 10% للعملاء الجدد", discountType: "PERCENTAGE", discountValue: 10, minPurchase: 3000, usageLimit: 100, isActive: true, startsAt: new Date("2024-01-01"), expiresAt: new Date("2027-12-31") },
  });
  await db.coupon.create({
    data: { code: "GOLD500", description: "خصم 500 درهم للطلبات فوق 5000 درهم", discountType: "FIXED", discountValue: 500, minPurchase: 5000, usageLimit: 50, isActive: true, startsAt: new Date("2024-01-01"), expiresAt: new Date("2027-06-30") },
  });
}
