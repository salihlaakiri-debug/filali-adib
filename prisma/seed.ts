import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
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
  await db.productVideo.deleteMany();
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
  const special = await db.category.create({
    data: { name: "مجوهرات خاصة", nameAr: "مجوهرات خاصة", nameFr: "Bijoux spéciaux", slug: "special", description: "مجوهرات فريدة ومميزة", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80", order: 6 },
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
  await db.profitMargin.create({ data: { categoryId: special.id, margin: 400, isActive: true } });

  console.log("Profit margins created");

  // ============================================
  // PRODUCTS (28 products across 6 categories)
  // ============================================

  const productsData = [
    // === RINGS (7 products) ===
    {
      name: "خاتم زواج ذهبي عيار 21", nameFr: "Bague de mariage en or 21 carats",
      slug: "gold-wedding-ring-21k", description: "خاتم زواج فاخر من الذهب عيار 21، صُنع يدوياً بحرفية عالية. يتميز بتصميم كلاسيكي أنيق يجمع بين الفخامة والبساطة.",
      descriptionFr: "Bague de mariage de luxe en or 21 carats, fabriquée à la main avec un design classique élégant.",
      sku: "FA-RNG-001", karat: "K21", weight: 5, goldPrice: 1300, profitMargin: 200,
      calculatedPrice: 7500, stock: 10, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: rings.id,
    },
    {
      name: "خاتم ألماس ذهبي عيار 18", nameFr: "Bague diamant en or 18 carats",
      slug: "diamond-ring-18k", description: "خاتم ذهبي عيار 18 مرصع بألماس طبيعي فاخر. تتلألأ حبات الألماس تحت الضوء ببريق ساحر.",
      descriptionFr: "Bague en or 18 carats sertie de diamants naturels de haute qualité.",
      sku: "FA-RNG-002", karat: "K18", weight: 8, goldPrice: 1100, profitMargin: 500,
      calculatedPrice: 12800, stock: 4, isFeatured: true, isNew: false, certification: "شهادة ألماس GIA", categoryId: rings.id,
    },
    {
      name: "خاتم زمرد ذهبي عيار 21", nameFr: "Bague émeraude en or 21 carats",
      slug: "emerald-ring-21k", description: "خاتم فاخر يمزج بين سحر الزمرد وبريق الذهب عيار 21. تصميم ملكي يخطف الأنفاس.",
      descriptionFr: "Bague de luxe alliant l'émeraude à l'or 21 carats avec un design royal.",
      sku: "FA-RNG-003", karat: "K21", weight: 7, goldPrice: 1300, profitMargin: 600,
      calculatedPrice: 11300, stock: 3, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: rings.id,
    },
    {
      name: "خاتم مغناطيسي ذهبي عيار 21", nameFr: "Bague magnétique en or 21 carats",
      slug: "magnetic-ring-21k", description: "خاتم مغناطيسي صحي من الذهب عيار 21. يجمع بين الجمال والفوائد الصحية للمغناطيسية.",
      descriptionFr: "Bague magnétique thérapeutique en or 21 carats, alliant beauté et bienfaits.",
      sku: "FA-RNG-004", karat: "K21", weight: 4, goldPrice: 1300, profitMargin: 250,
      calculatedPrice: 6450, stock: 12, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: rings.id,
    },
    {
      name: "خاتم سوليتير ألماس عيار 18", nameFr: "Bague solitaire diamant en or 18 carats",
      slug: "solitaire-ring-18k", description: "خاتم سوليتير كلاسيكي بحجر ألماس واحد مثالي للخطوبة. تصميم خالد يعكس الأناقة المطلقة.",
      descriptionFr: "Bague solitaire classique avec diamant unique, parfaite pour les fiançailles.",
      sku: "FA-RNG-005", karat: "K18", weight: 6, goldPrice: 1100, profitMargin: 800,
      calculatedPrice: 10000, stock: 5, isFeatured: true, isNew: false, certification: "شهادة ألماس GIA", categoryId: rings.id,
    },
    {
      name: "خاتم ثلاثة ألماس عيار 18", nameFr: "Bague trois diamants en or 18 carats",
      slug: "three-stone-ring-18k", description: "خاتم بثلاث حبات ألماس تمثل الماضي والحاضر والمستقبل. رمز للحب الأبدي.",
      descriptionFr: "Bague avec trois diamants symbolisant le passé, le présent et l'avenir.",
      sku: "FA-RNG-006", karat: "K18", weight: 7.5, goldPrice: 1100, profitMargin: 700,
      calculatedPrice: 11650, stock: 3, isFeatured: false, isNew: true, certification: "شهادة ألماس GIA", categoryId: rings.id,
    },
    {
      name: "خاتم рубين ذهبي عيار 21", nameFr: "Bague rubis en or 21 carats",
      slug: "ruby-ring-21k", description: "خاتم ياقة بأحمر ياقوت طبيعي محاط بالألماس الصغير. قطعة فنية مميزة.",
      descriptionFr: "Bague chevalière avec rubis naturel entouré de petits diamants.",
      sku: "FA-RNG-007", karat: "K21", weight: 9, goldPrice: 1300, profitMargin: 900,
      calculatedPrice: 16400, stock: 2, isFeatured: false, isNew: false, certification: "شهادة أحجار كريمة", categoryId: rings.id,
    },

    // === NECKLACES (6 products) ===
    {
      name: "قلادة ذهبية عيار 18", nameFr: "Collier en or 18 carats",
      slug: "gold-necklace-18k", description: "قلادة ذهبية عيار 18 بتصميم أنيق وعصري. خفيفة ومريحة للارتداء اليومي مع لمسة من الفخامة.",
      descriptionFr: "Collier élégant en or 18 carats, léger et confortable pour un usage quotidien.",
      sku: "FA-NCK-001", karat: "K18", weight: 10, goldPrice: 1100, profitMargin: 250,
      calculatedPrice: 13500, stock: 5, isFeatured: true, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },
    {
      name: "قلادة سلاسل متعددة عيار 21", nameFr: "Collier chaînes superposées en or 21 carats",
      slug: "layered-necklace-21k", description: "قلادة سلاسل متعددة الطبقات من الذهب عيار 21. تصميم عصري يجمع بين الحداثة والتراث.",
      descriptionFr: "Collier à chaînes superposées en or 21 carats, design moderne et traditionnel.",
      sku: "FA-NCK-002", karat: "K21", weight: 12, goldPrice: 1300, profitMargin: 280,
      calculatedPrice: 19560, stock: 6, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },
    {
      name: "قلادة ألماس عيار 18", nameFr: "Collier diamant en or 18 carats",
      slug: "diamond-necklace-18k", description: "قلادة فاخرة مرصعة بحبات ألماس متلألئة. تضفي بريقاً استثنائياً على أي إطلالة.",
      descriptionFr: "Collier de luxe serti de diamants scintillants pour un éclat exceptionnel.",
      sku: "FA-NCK-003", karat: "K18", weight: 15, goldPrice: 1100, profitMargin: 800,
      calculatedPrice: 22050, stock: 2, isFeatured: true, isNew: false, certification: "شهادة ألماس GIA", categoryId: necklaces.id,
    },
    {
      name: "قلادة هنيcombe ذهبية عيار 21", nameFr: "Collier figaro en or 21 carats",
      slug: "figaro-necklace-21k", description: "قلادة فيغارو كلاسيكية من الذهب عيار 21. تصميم إيطالي أنيق يلائم الرجال والنساء.",
      descriptionFr: "Collier figaro classique en or 21 carats, design italien élégant.",
      sku: "FA-NCK-004", karat: "K21", weight: 18, goldPrice: 1300, profitMargin: 300,
      calculatedPrice: 26100, stock: 4, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },
    {
      name: "قلادة لؤلؤ ذهبية عيار 18", nameFr: "Collier perles en or 18 carats",
      slug: "pearl-necklace-18k", description: "قلادة تجمع بين نقاء اللؤلؤ الطبيعي ودفء الذهب عيار 18. أناقة لا تخلو.",
      descriptionFr: "Collier alliant la pureté des perles naturelles à la chaleur de l'or 18 carats.",
      sku: "FA-NCK-005", karat: "K18", weight: 8, goldPrice: 1100, profitMargin: 350,
      calculatedPrice: 12100, stock: 6, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },
    {
      name: "قلادة فينيت ذهبية عيار 21", nameFr: "Collier vénitien en or 21 carats",
      slug: "venetian-necklace-21k", description: "قلادة بتصميم فينيتي كلاسيكي من الذهب عيار 21. رمز للحب الأبدي والارتباط.",
      descriptionFr: "Collier avec pendentif vénitien classique en or 21 carats, symbole d'amour éternel.",
      sku: "FA-NCK-006", karat: "K21", weight: 6, goldPrice: 1300, profitMargin: 250,
      calculatedPrice: 9600, stock: 8, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },

    // === EARRINGS (6 products) ===
    {
      name: "أقراط ذهبية عيار 21", nameFr: "Boucles d'oreilles en or 21 carats",
      slug: "gold-earrings-21k", description: "أقراط ذهبية عيار 21 بتصميم راقي وبسيط. مثالية للارتداء اليومي والمناسبات الخاصة.",
      descriptionFr: "Boucles d'oreilles élégantes en or 21 carats, parfaites pour le quotidien et les occasions.",
      sku: "FA-EAR-001", karat: "K21", weight: 3.5, goldPrice: 1300, profitMargin: 180,
      calculatedPrice: 5130, stock: 15, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: earrings.id,
    },
    {
      name: "أقراط ألماس ذهبية عيار 18", nameFr: "Boucles d'oreilles diamant en or 18 carats",
      slug: "diamond-earrings-18k", description: "أقراط ألماس فاخرة تضفي لمسة من البريق الفائق. تصميم أنيق يليق بالمرأة العصرية.",
      descriptionFr: "Boucles d'oreilles diamant de luxe pour un éclat extraordinaire.",
      sku: "FA-EAR-002", karat: "K18", weight: 4, goldPrice: 1100, profitMargin: 600,
      calculatedPrice: 7000, stock: 6, isFeatured: true, isNew: false, certification: "شهادة ألماس GIA", categoryId: earrings.id,
    },
    {
      name: "أقراط لؤلؤ ذهبية عيار 21", nameFr: "Boucles d'oreilles perle en or 21 carats",
      slug: "pearl-earrings-21k", description: "أقراط ذهبية عيار 21 مع حبات لؤلؤ طبيعي فاخرة. جمال الطبيعة في قطعة مجوهرات.",
      descriptionFr: "Boucles d'oreilles en or 21 carats avec perles naturelles de luxe.",
      sku: "FA-EAR-003", karat: "K21", weight: 4, goldPrice: 1300, profitMargin: 220,
      calculatedPrice: 6080, stock: 8, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: earrings.id,
    },
    {
      name: "أقراط دوارة ذهبية عيار 21", nameFr: "Boucles d'oreilles pendantes en or 21 carats",
      slug: "drop-earrings-21k", description: "أقراط دوارة متدلية بتصميم راقي. تتمايل مع حركتك وتضيف جاذبية استثنائية.",
      descriptionFr: "Boucles d'oreilles pendantes au design raffiné, brillant à chaque mouvement.",
      sku: "FA-EAR-004", karat: "K21", weight: 5, goldPrice: 1300, profitMargin: 250,
      calculatedPrice: 7750, stock: 7, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: earrings.id,
    },
    {
      name: "أقراط زمرد ذهبية عيار 18", nameFr: "Boucles d'oreilles émeraude en or 18 carats",
      slug: "emerald-earrings-18k", description: "أقراط بأحجار زمرد طبيعي محاطة بالذهب عيار 18. قطعة استثنائية للمコレكشن.",
      descriptionFr: "Boucles d'oreilles avec émeraudes naturelles serties dans l'or 18 carats.",
      sku: "FA-EAR-005", karat: "K18", weight: 5, goldPrice: 1100, profitMargin: 700,
      calculatedPrice: 9000, stock: 3, isFeatured: false, isNew: false, certification: "شهادة أحجار كريمة", categoryId: earrings.id,
    },
    {
      name: "أقراط كريستال ذهبية عيار 21", nameFr: "Boucles d'oreilles cristal en or 21 carats",
      slug: "crystal-earrings-21k", description: "أقراط بلمسة كريستالية عصرية من الذهب عيار 21. تصميم يجمع بين الحداثة والأصالة.",
      descriptionFr: "Boucles d'oreilles cristal modernes en or 21 carats, entre modernité et authenticité.",
      sku: "FA-EAR-006", karat: "K21", weight: 3, goldPrice: 1300, profitMargin: 200,
      calculatedPrice: 4500, stock: 10, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: earrings.id,
    },

    // === BRACELETS (5 products) ===
    {
      name: "سوار ذهبي عيار 24", nameFr: "Bracelet en or 24 carats",
      slug: "gold-bracelet-24k", description: "سوار ذهبي عيار 24 عالي الجودة. الذهب النقي في أبهى صورة مع تصميم كلاسيكي خالد.",
      descriptionFr: "Bracelet en or pur 24 carats de haute qualité, design classique intemporel.",
      sku: "FA-BRC-001", karat: "K24", weight: 15, goldPrice: 1500, profitMargin: 220,
      calculatedPrice: 25800, stock: 3, isFeatured: true, isNew: false, certification: "شهادة نقاء ذهب", categoryId: bracelets.id,
    },
    {
      name: "سوار ت Ủا ذهبي عيار 21", nameFr: "Bracelet tennis en or 21 carats",
      slug: "tennis-bracelet-21k", description: "سوار تينيس مرصع بألماس صغير من الذهب عيار 21. أناقة رياضية تتحول إلى فخامة.",
      descriptionFr: "Bracelet tennis serti de petits diamants en or 21 carats.",
      sku: "FA-BRC-002", karat: "K21", weight: 10, goldPrice: 1300, profitMargin: 500,
      calculatedPrice: 18000, stock: 4, isFeatured: true, isNew: true, certification: "شهادة ألماس GIA", categoryId: bracelets.id,
    },
    {
      name: "سوار مينا ذهبي عيار 21", nameFr: "Bracelet émail en or 21 carats",
      slug: "enamel-bracelet-21k", description: "سوار ذهبي بالمينا الملونة عيار 21. لمسة من الألوان تضفي حيوية وفخامة.",
      descriptionFr: "Bracelet en or 21 carats avec émail coloré pour une touche vibrante.",
      sku: "FA-BRC-003", karat: "K21", weight: 8, goldPrice: 1300, profitMargin: 300,
      calculatedPrice: 13000, stock: 5, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: bracelets.id,
    },
    {
      name: "سوار سيربنتين ذهبي عيار 21", nameFr: "Bracelet serpentin en or 21 carats",
      slug: "serpentine-bracelet-21k", description: "سوار بتصميم ثعباني جريء من الذهب عيار 21. قطعة جريئة لمن تحب التميز.",
      descriptionFr: "Bracelet au design serpentin audacieux en or 21 carats.",
      sku: "FA-BRC-004", karat: "K21", weight: 12, goldPrice: 1300, profitMargin: 350,
      calculatedPrice: 20100, stock: 3, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: bracelets.id,
    },
    {
      name: "سوار مرجاني ذهبي عيار 18", nameFr: "Bracelet corail en or 18 carats",
      slug: "coral-bracelet-18k", description: "سوار يجمع بين المرجان الطبيعي والذهب عيار 18. قطعة طبيعية فريدة.",
      descriptionFr: "Bracelet alliant corail naturel et or 18 carats, pièce naturelle unique.",
      sku: "FA-BRC-005", karat: "K18", weight: 9, goldPrice: 1100, profitMargin: 280,
      calculatedPrice: 12420, stock: 4, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: bracelets.id,
    },

    // === SETS (2 products) ===
    {
      name: "طقم ذهبي كامل عيار 21", nameFr: "Parure complète en or 21 carats",
      slug: "gold-set-21k", description: "طقم مجوهرات ذهبي كامل يشمل خاتم وقلادة وأقراط. تصميم متناسق لاطلالة متكاملة ومميزة.",
      descriptionFr: "Parure complète en or 21 carats comprenant bague, collier et boucles d'oreilles.",
      sku: "FA-SET-001", karat: "K21", weight: 25, goldPrice: 1300, profitMargin: 300,
      calculatedPrice: 40000, stock: 2, isFeatured: true, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: sets.id,
    },
    {
      name: "طقم ألماس فاخر عيار 18", nameFr: "Parure diamant de luxe en or 18 carats",
      slug: "diamond-set-18k", description: "طقم مجوهرات فاخر مرصع بألماس عيار 18. لمن تقدّر الجمال الاستثنائي والفخامة المطلقة.",
      descriptionFr: "Parure de luxe sertie de diamants en or 18 carats pour une beauté exceptionnelle.",
      sku: "FA-SET-002", karat: "K18", weight: 30, goldPrice: 1100, profitMargin: 1000,
      calculatedPrice: 43000, stock: 1, isFeatured: true, isNew: false, certification: "شهادة ألماس GIA", categoryId: sets.id,
    },

    // === SPECIAL (2 products) ===
    {
      name: "دبوس صدر ألماس ذهبي", nameFr: "Broche diamant en or",
      slug: "diamond-brooch", description: "دبوس صدر فاخر مرصع بألماس بتصميم هندسي أنيق. قطعة تكميلية تضفي لمسة من الأناقة.",
      descriptionFr: "Broche de luxe sertie de diamants au design géométrique élégant.",
      sku: "FA-SPC-001", karat: "K18", weight: 6, goldPrice: 1100, profitMargin: 400,
      calculatedPrice: 9200, stock: 4, isFeatured: false, isNew: true, certification: "شهادة ألماس GIA", categoryId: special.id,
    },
    {
      name: "عقد ملكي ذهبي عيار 21", nameFr: "Collier royal en or 21 carats",
      slug: "royal-necklace-21k", description: "عقد ملكي فاخر يعود بتصميمه إلى عصر الأندلس. تحفة فنية تعكس تراث فاس العريق.",
      descriptionFr: "Collier royal de luxe au design andalou, reflet du riche héritage de Fès.",
      sku: "FA-SPC-002", karat: "K21", weight: 35, goldPrice: 1300, profitMargin: 800,
      calculatedPrice: 57050, stock: 1, isFeatured: false, isNew: false, certification: "شهادة تحفة فنية", categoryId: special.id,
    },

    // === ADDITIONAL PRODUCTS (7 more to reach 35) ===
    {
      name: "خاتم كارتيه ذهبي عيار 21", nameFr: "Bague Cartier style en or 21 carats",
      slug: "cartier-style-ring-21k", description: "خاتم بأسلوب كارتيه الكلاسيكي من الذهب عيار 21. تصميم أيقوني يعكس الذوق الرفيع.",
      descriptionFr: "Bague au style Cartier classique en or 21 carats, un design iconique.",
      sku: "FA-RNG-008", karat: "K21", weight: 6, goldPrice: 1300, profitMargin: 350,
      calculatedPrice: 9750, stock: 6, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: rings.id,
    },
    {
      name: "قلادة قلب ذهبية عيار 21", nameFr: "Collier coeur en or 21 carats",
      slug: "heart-necklace-21k", description: "قلادة بقلادة على شكل قلب من الذهب عيار 21. هدية مثالية للحب والأبد.",
      descriptionFr: "Collier avec pendentif coeur en or 21 carats, cadeau d'amour parfait.",
      sku: "FA-NCK-007", karat: "K21", weight: 5, goldPrice: 1300, profitMargin: 250,
      calculatedPrice: 8000, stock: 10, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: necklaces.id,
    },
    {
      name: "أقراط حلقي ذهبي عيار 21", nameFr: "Boucles d'oreilles cerclées en or 21 carats",
      slug: "hoop-earrings-21k", description: "أقراط حلقي كبيرة بتصميم عصري من الذهب عيار 21. تضيف جاذبية وثقة لأي إطلالة.",
      descriptionFr: "Boucles d'oreilles cerclées grandes au design moderne en or 21 carats.",
      sku: "FA-EAR-007", karat: "K21", weight: 6, goldPrice: 1300, profitMargin: 220,
      calculatedPrice: 9000, stock: 9, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: earrings.id,
    },
    {
      name: "سوار كفية ذهبية عيار 21", nameFr: "Bracelet manchette en or 21 carats",
      slug: "cuff-bracelet-21k", description: "سوار كفية عريض بتصميم جريء من الذهب عيار 21. قطعة م Statement تلفت الأنظار.",
      descriptionFr: "Bracelet manchette large au design audacieux en or 21 carats.",
      sku: "FA-BRC-006", karat: "K21", weight: 20, goldPrice: 1300, profitMargin: 400,
      calculatedPrice: 32200, stock: 2, isFeatured: false, isNew: false, certification: "شهادة أصالة معتمدة", categoryId: bracelets.id,
    },
    {
      name: "طقم لؤلؤ ذهبي عيار 21", nameFr: "Parure perles en or 21 carats",
      slug: "pearl-set-21k", description: "طقم مجوهرات يجمع بين اللؤلؤ الطبيعي والذهب عيار 21. أناقة مطلقة للمناسبات.",
      descriptionFr: "Parure alliant perles naturelles et or 21 carats pour une élégance absolue.",
      sku: "FA-SET-003", karat: "K21", weight: 20, goldPrice: 1300, profitMargin: 350,
      calculatedPrice: 32000, stock: 3, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: sets.id,
    },
    {
      name: "دبوس فينيتي ذهبي عيار 18", nameFr: "Broche infini en or 18 carats",
      slug: "infinity-brooch-18k", description: "دبوس صدر بتصميم فينيتي أنيق من الذهب عيار 18. رمز للحب الأبدي والأناقة.",
      descriptionFr: "Broche au design infini élégant en or 18 carats, symbole d'amour éternel.",
      sku: "FA-SPC-003", karat: "K18", weight: 4, goldPrice: 1100, profitMargin: 300,
      calculatedPrice: 5800, stock: 8, isFeatured: false, isNew: true, certification: "شهادة أصالة معتمدة", categoryId: special.id,
    },
    {
      name: "خاتم أوبال ذهبي عيار 21", nameFr: "Bague opale en or 21 carats",
      slug: "opal-ring-21k", description: "خاتم بأحجار أوبال طبيعية متلألئة من الذهب عيار 21. جمال الطبيعة في قطعة مجوهرات.",
      descriptionFr: "Bague avec opales naturelles scintillantes en or 21 carats.",
      sku: "FA-RNG-009", karat: "K21", weight: 5.5, goldPrice: 1300, profitMargin: 450,
      calculatedPrice: 8900, stock: 4, isFeatured: false, isNew: false, certification: "شهادة أحجار كريمة", categoryId: rings.id,
    },
  ];

  // Product images (diverse Unsplash jewelry images - 3-4 per product)
  const productImages: Record<string, string[]> = {
    "gold-wedding-ring-21k": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    ],
    "diamond-ring-18k": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    ],
    "emerald-ring-21k": [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1599459183200-59c3f861d2b3?w=800&q=80",
    ],
    "magnetic-ring-21k": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    ],
    "solitaire-ring-18k": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    ],
    "three-stone-ring-18k": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    ],
    "ruby-ring-21k": [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1599459183200-59c3f861d2b3?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    ],
    "gold-necklace-18k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
    ],
    "layered-necklace-21k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    ],
    "diamond-necklace-18k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    ],
    "figaro-necklace-21k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    ],
    "pearl-necklace-18k": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    ],
    "venetian-necklace-21k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    ],
    "gold-earrings-21k": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    "diamond-earrings-18k": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
    ],
    "pearl-earrings-21k": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    "drop-earrings-21k": [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
    ],
    "emerald-earrings-18k": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1599459183200-59c3f861d2b3?w=800&q=80",
    ],
    "crystal-earrings-21k": [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
    ],
    "gold-bracelet-24k": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    ],
    "tennis-bracelet-21k": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    ],
    "enamel-bracelet-21k": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    ],
    "serpentine-bracelet-21k": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    ],
    "coral-bracelet-18k": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    ],
    "gold-set-21k": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    ],
    "diamond-set-18k": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d569b2c8?w=800&q=80",
    ],
    "diamond-brooch": [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    ],
    "royal-necklace-21k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    ],
    "cartier-style-ring-21k": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    ],
    "heart-necklace-21k": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    ],
    "hoop-earrings-21k": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
    ],
    "cuff-bracelet-21k": [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    ],
    "pearl-set-21k": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    ],
    "infinity-brooch-18k": [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    ],
    "opal-ring-21k": [
      "https://images.unsplash.com/photo-1599459183200-59c3f861d2b3?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    ],
  };

  // Product videos (YouTube jewelry showcase videos)
  const productVideos: Record<string, { url: string; title: string }[]> = {
    "gold-wedding-ring-21k": [
      { url: "https://www.youtube.com/embed/Upm6cKooP6Y", title: "تصميم خاتم الزواج الذهبي" },
    ],
    "diamond-ring-18k": [
      { url: "https://www.youtube.com/embed/vkGdmJ8P9xg", title: "تفاصيل ألماس الخاتم" },
    ],
    "emerald-ring-21k": [
      { url: "https://www.youtube.com/embed/8A2Gi6OMAuE", title: "سحر الزمرد والذهب" },
    ],
    "gold-necklace-18k": [
      { url: "https://www.youtube.com/embed/vkGdmJ8P9xg", title: "عرض القلادة الذهبية" },
    ],
    "diamond-necklace-18k": [
      { url: "https://www.youtube.com/embed/vkGdmJ8P9xg", title: "بريق قلادة الألماس" },
    ],
    "figaro-necklace-21k": [
      { url: "https://www.youtube.com/embed/LcHNpRzssS0", title: "سلسلة فيغارو الذهبية" },
    ],
    "gold-bracelet-24k": [
      { url: "https://www.youtube.com/embed/8A2Gi6OMAuE", title: "جودة الذهب عيار 24" },
    ],
    "tennis-bracelet-21k": [
      { url: "https://www.youtube.com/embed/vkGdmJ8P9xg", title: "سوار التينيس الماسي" },
    ],
    "gold-set-21k": [
      { url: "https://www.youtube.com/embed/Upm6cKooP6Y", title: "عرض الطقم الكامل" },
    ],
    "diamond-set-18k": [
      { url: "https://www.youtube.com/embed/vkGdmJ8P9xg", title: "طقم الألماس الفاخر" },
    ],
    "royal-necklace-21k": [
      { url: "https://www.youtube.com/embed/LcHNpRzssS0", title: "العقد الملكي الأندلسي" },
    ],
    "solitaire-ring-18k": [
      { url: "https://www.youtube.com/embed/8A2Gi6OMAuE", title: "خاتم السوليتير الكلاسيكي" },
    ],
    "gold-earrings-21k": [
      { url: "https://www.youtube.com/embed/Upm6cKooP6Y", title: "أقراط الذهب العصرية" },
    ],
    "drop-earrings-21k": [
      { url: "https://www.youtube.com/embed/LcHNpRzssS0", title: "أقراط دوارة أنيقة" },
    ],
  };

  for (const pd of productsData) {
    const product = await db.product.create({ data: pd });

    // Create images
    const images = productImages[pd.slug] || [];
    for (let i = 0; i < images.length; i++) {
      await db.productImage.create({
        data: { url: images[i], alt: `${product.name} - صورة ${i + 1}`, order: i, productId: product.id },
      });
    }

    // Create videos
    const videos = productVideos[pd.slug] || [];
    for (let i = 0; i < videos.length; i++) {
      await db.productVideo.create({
        data: { url: videos[i].url, type: "youtube", title: videos[i].title, order: i, productId: product.id },
      });
    }
  }

  console.log(`Products created: ${productsData.length}`);

  // Reviews (for some products)
  const allProducts = await db.product.findMany({ take: 5 });
  const reviewData = [
    { rating: 5, comment: "منتج رائع جداً، جودة عالية وتصميم أنيق. أنصح به بشدة!", userId: customer.id },
    { rating: 4, comment: "جميل جداً لكن التوصيل استغرق وقتاً أطول من المتوقع.", userId: customer.id },
    { rating: 5, comment: "أفضل متجر مجوهرات تعاملت معه. خدمة ممتازة ومنتجات أصلية.", userId: customer.id },
    { rating: 5, comment: "هدايا مثالية لمن تحب. التغليف فخم جداً.", userId: customer.id },
    { rating: 4, comment: "الذهب بجودة عالية والسعر مناسب مقارنة بالسوق.", userId: customer.id },
  ];

  for (let i = 0; i < allProducts.length; i++) {
    const review = reviewData[i % reviewData.length];
    await db.review.create({
      data: { ...review, productId: allProducts[i].id, isApproved: true },
    });
  }

  console.log("Reviews created");

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
  await db.coupon.create({
    data: {
      code: "EID2026", description: "خصم 15% بمناسبة العيد",
      discountType: "PERCENTAGE", discountValue: 15, minPurchase: 2000,
      usageLimit: 200, isActive: true,
      startsAt: new Date("2026-01-01"), expiresAt: new Date("2027-12-31"),
    },
  });

  console.log("Coupons created");
  console.log("Seeding complete!");
  console.log("");
  console.log(`Total: ${productsData.length} products, ${Object.values(productImages).reduce((a, b) => a + b.length, 0)} images, ${Object.values(productVideos).reduce((a, b) => a + b.length, 0)} videos`);
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
