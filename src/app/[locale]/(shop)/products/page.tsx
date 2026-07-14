import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ProductsPageContent } from "./ProductsPageContent";

const siteUrl = "https://filali-adib.vercel.app";

const metaByLocale: Record<string, { title: string; description: string }> = {
  ar: {
    title: "المنتجات | فيلالي عديب - حرفي مجوهرات",
    description: "اكتشف تشكيلتنا الفاخرة من المجوهرات الذهبية عيار 18. خواتم، سلاسل، أقراط، وأطقم مجوهرات بأسعار تنافسية في فاس، المغرب.",
  },
  fr: {
    title: "Produits | Filali Adib - Artiste Joaillier",
    description: "Découvrez notre collection de bijoux en or 18 carats. Bagues, colliers, boucles d'oreilles et parures à des prix compétitifs à Fès, Maroc.",
  },
  en: {
    title: "Products | Filali Adib - Master Jeweler",
    description: "Discover our luxury 18-karat gold jewelry collection. Rings, necklaces, earrings, and jewelry sets at competitive prices in Fes, Morocco.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] || metaByLocale.ar;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${siteUrl}/${locale}/products`,
      siteName: "Filali Adib - Artiste Joaillier",
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Filali Adib - Products",
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/products`,
      languages: {
        ar: `${siteUrl}/ar/products`,
        fr: `${siteUrl}/fr/products`,
        en: `${siteUrl}/en/products`,
      },
    },
  };
}

export default function ProductsPage() {
  return <ProductsPageContent />;
}
