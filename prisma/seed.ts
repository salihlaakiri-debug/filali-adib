import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const db = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean all tables in order (respect foreign keys)
  await db.analyticsEvent.deleteMany();
  await db.notification.deleteMany();
  await db.coupon.deleteMany();
  await db.review.deleteMany();
  await db.wishlist.deleteMany();
  await db.favorite.deleteMany();
  await db.cartItem.deleteMany();
  await db.orderItem.deleteMany();
  await db.payment.deleteMany();
  await db.shipment.deleteMany();
  await db.order.deleteMany();
  await db.address.deleteMany();
  await db.productVariant.deleteMany();
  await db.productImage.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.goldPrice.deleteMany();
  await db.profitMargin.deleteMany();
  await db.session.deleteMany();
  await db.verificationToken.deleteMany();
  await db.user.deleteMany();

  // Users
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

  const customer = await db.user.create({
    data: {
      email: "customer@example.com",
      name: "أحمد محمد",
      password: customerPassword,
      phone: "+212611111111",
      role: "CUSTOMER",
    },
  });

  console.log("Users created:", admin.email, customer.email);

  // Categories
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

  console.log("Categories created");

  // Gold Prices
  await db.goldPrice.create({ data: { karat: "K18", price: 1100, currency: "MAD", source: "manual", isActive: true } });
  await db.goldPrice.create({ data: { karat: "K21", price: 1300, currency: "MAD", source: "manual", isActive: true } });
  await db.goldPrice.create({ data: { karat: "K24", price: 1500, currency: "MAD", source: "manual", isActive: true } });

  console.log("Gold prices created");

  // Profit Margins
  await db.profitMargin.create({ data: { categoryId: rings.id, margin: 200, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: necklaces.id, margin: 250, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: earrings.id, margin: 180, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: bracelets.id, margin: 220, isActive: true } });
  await db.profitMargin.create({ data: { categoryId: sets.id, margin: 300, isActive: true } });

  console.log("Profit margins created");

  // Products
  const productsData = [
    {
      name: "خاتم زواج ذهبي عيار 21", nameFr: "Bague de mariage en or 21 carats",
      slug: "gold-wedding-ring-21k", description: "خاتم زواج فاخر من الذهب عيار 21، صُنع يدوياً بحرفية عالية.",
      descriptionFr: "Bague de mariage de luxe en or 21 carats, fabriquée à la main.",
      sku: "FA-RNG-001", karat: "K21", weight: 5, goldPrice: 1300, profitMargin: 200,
      calculatedPrice: 7500, stock: 10, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: rings.id,
    },
    {
      name: "قلادة ذهبية عيار 18", nameFr: "Collier en or 18 carats",
      slug: "gold-necklace-18k", description: "قلادة ذهبية عيار 18 بتصميم أنيق وعصري.",
      descriptionFr: "Collier élégant en or 18 carats.",
      sku: "FA-NCK-002", karat: "K18", weight: 10, goldPrice: 1100, profitMargin: 250,
      calculatedPrice: 13500, stock: 5, isFeatured: true, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },
    {
      name: "أقراط ذهبية عيار 21", nameFr: "Boucles d'oreilles en or 21 carats",
      slug: "gold-earrings-21k", description: "أقراط ذهبية عيار 21 بتصميم راقي.",
      descriptionFr: "Boucles d'oreilles élégantes en or 21 carats.",
      sku: "FA-EAR-003", karat: "K21", weight: 3.5, goldPrice: 1300, profitMargin: 180,
      calculatedPrice: 5130, stock: 15, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: earrings.id,
    },
    {
      name: "سوار ذهبي عيار 24", nameFr: "Bracelet en or 24 carats",
      slug: "gold-bracelet-24k", description: "سوار ذهبي عيار 24 عالي الجودة.",
      descriptionFr: "Bracelet en or pur 24 carats.",
      sku: "FA-BRC-004", karat: "K24", weight: 15, goldPrice: 1500, profitMargin: 220,
      calculatedPrice: 25800, stock: 3, isFeatured: true, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: bracelets.id,
    },
    {
      name: "طقم ذهبي كامل عيار 21", nameFr: "Parure complète en or 21 carats",
      slug: "gold-set-21k", description: "طقم مجوهرات ذهبي كامل يشمل خاتم وقلادة وأقراط.",
      descriptionFr: "Parure complète en or 21 carats.",
      sku: "FA-SET-005", karat: "K21", weight: 25, goldPrice: 1300, profitMargin: 300,
      calculatedPrice: 40000, stock: 2, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: sets.id,
    },
    {
      name: "خاتم ألماس ذهبي عيار 18", nameFr: "Bague diamant en or 18 carats",
      slug: "diamond-ring-18k", description: "خاتم ذهبي عيار 18 مرصع بألماس طبيعي فاخر.",
      descriptionFr: "Bague en or 18 carats sertie de diamants.",
      sku: "FA-RNG-006", karat: "K18", weight: 8, goldPrice: 1100, profitMargin: 500,
      calculatedPrice: 12800, stock: 4, isFeatured: false, isNew: false, certification: "شهادة ألماس معتمدة", categoryId: rings.id,
    },
    {
      name: "سلاسل ذهبية عيار 21", nameFr: "Chaîne en or 21 carats",
      slug: "layered-necklace-21k", description: "قلادة سلاسل متعددة الطبقات من الذهب عيار 21.",
      descriptionFr: "Collier à chaînes superposées en or 21 carats.",
      sku: "FA-NCK-007", karat: "K21", weight: 12, goldPrice: 1300, profitMargin: 280,
      calculatedPrice: 19560, stock: 6, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },
    {
      name: "أقراط لؤلؤ ذهبية عيار 21", nameFr: "Boucles d'oreilles perle en or 21 carats",
      slug: "pearl-earrings-21k", description: "أقراط ذهبية عيار 21 مع حبات لؤلؤ طبيعي.",
      descriptionFr: "Boucles d'oreilles en or 21 carats avec perles naturelles.",
      sku: "FA-EAR-008", karat: "K21", weight: 4, goldPrice: 1300, profitMargin: 220,
      calculatedPrice: 6080, stock: 8, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: earrings.id,
    },
  ];

  // Product images (real Unsplash jewelry images)
  const productImages: Record<string, string[]> = {
    "gold-wedding-ring-21k": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    ],
    "gold-necklace-18k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    ],
    "gold-earrings-21k": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
    ],
    "gold-bracelet-24k": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    ],
    "gold-set-21k": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    ],
    "diamond-ring-18k": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
    ],
    "layered-necklace-21k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    ],
    "pearl-earrings-21k": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
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

  console.log("Products created");

  // Coupons
  await db.coupon.create({
    data: {
      code: "WELCOME10", description: "خصم 10% للعملاء الجدد",
      discountType: "PERCENTAGE", discountValue: 10, minPurchase: 3000,
      usageLimit: 100, isActive: true,
      startsAt: new Date("2024-01-01"), expiresAt: new Date("2027-12-31"),
    },
  });
  await db.coupon.create({
    data: {
      code: "GOLD500", description: "خصم 500 درهم للطلبات فوق 5000 درهم",
      discountType: "FIXED", discountValue: 500, minPurchase: 5000,
      usageLimit: 50, isActive: true,
      startsAt: new Date("2024-01-01"), expiresAt: new Date("2027-06-30"),
    },
  });

  console.log("Coupons created");
  console.log("Seeding complete!");
  console.log("");
  console.log("Login credentials:");
  console.log("  Admin:   admin@filaliadib.com / admin123");
  console.log("  Customer: customer@example.com / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
