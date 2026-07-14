import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductDetailContent } from "./ProductDetailContent";

const siteUrl = "https://filali-adib.vercel.app";

const metaByLocale: Record<string, { suffix: string; prefix: string }> = {
  ar: { suffix: " | فيلالي عديب - حرفي مجوهرات", prefix: "" },
  fr: { suffix: " | Filali Adib - Artiste Joaillier", prefix: "" },
  en: { suffix: " | Filali Adib - Master Jeweler", prefix: "" },
};

export async function generateStaticParams() {
  if (!db) return [];
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      take: 100,
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function getProduct(slug: string) {
  if (!db) return null;
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { images: true, videos: true, category: true },
    });
    if (!product || !product.isActive) return null;
    return product;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const meta = metaByLocale[locale] || metaByLocale.ar;
  const productName = locale === "ar" ? product.nameAr || product.name : locale === "fr" ? product.nameFr || product.name : product.name;
  const description = locale === "ar"
    ? product.descriptionAr || product.description || `${productName} - مجوهرات ذهبية عيار ${product.karat} بوزن ${product.weight}غ في فيلالي عديب، فاس`
    : locale === "fr"
    ? product.descriptionFr || product.description || `${productName} - Bijou en or ${product.karat} pesant ${product.weight}g chez Filali Adib, Fès`
    : product.descriptionFr || product.description || `${productName} - ${product.karat} gold jewelry weighing ${product.weight}g at Filali Adib, Fes`;

  const title = `${productName}${meta.suffix}`;
  const productUrl = `${siteUrl}/${locale}/products/${slug}`;
  const imageUrl = product.images?.[0]?.url || `${siteUrl}/og-image.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "Filali Adib - Artiste Joaillier",
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_US",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl,
      languages: {
        ar: `${siteUrl}/ar/products/${slug}`,
        fr: `${siteUrl}/fr/products/${slug}`,
        en: `${siteUrl}/en/products/${slug}`,
      },
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  const structuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || `${product.name} - ${product.karat} gold jewelry`,
        image: product.images?.[0]?.url,
        url: `${siteUrl}/en/products/${slug}`,
        sku: product.sku,
        brand: {
          "@type": "Brand",
          name: "Filali Adib",
        },
        offers: {
          "@type": "Offer",
          price: product.calculatedPrice,
          priceCurrency: "MAD",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: {
            "@type": "JewelryStore",
            name: "Filali Adib - Artiste Joaillier",
            address: {
              "@type": "PostalAddress",
              streetAddress: "الطالعة الكبيرة 42، فاس المرينية",
              addressLocality: "Fès",
              addressCountry: "MA",
              postalCode: "30000",
            },
          },
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
        material: `Gold ${product.karat}`,
        weight: {
          "@type": "QuantitativeValue",
          value: product.weight,
          unitCode: "GRM",
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Karat",
            value: product.karat,
          },
          ...(product.certification
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Certification",
                  value: product.certification,
                },
              ]
            : []),
        ],
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <ProductDetailContent />
    </>
  );
}
