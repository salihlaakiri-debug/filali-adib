import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { AboutPageContent } from "./AboutPageContent";

const siteUrl = "https://filali-adib.vercel.app";

const metaByLocale: Record<string, { title: string; description: string }> = {
  ar: {
    title: "من نحن | فيلالي عديب - حرفي مجوهرات",
    description: "اكتشف قصة فيلالي عديب، حرفي مجوهرات مغربي بخبرة 40 عاماً في فاس. تراث حرفية فاسية أصيلة في صناعة المجوهرات الذهبية.",
  },
  fr: {
    title: "À Propos | Filali Adib - Artiste Joaillier",
    description: "Découvrez l'histoire de Filali Adib, artisan joaillier marocain avec 40 ans d'expérience à Fès. Un héritage artisanal fassi authentique.",
  },
  en: {
    title: "About Us | Filali Adib - Master Jeweler",
    description: "Discover the story of Filali Adib, a Moroccan jewelry artisan with 40 years of experience in Fes. An authentic Fassi craftsmanship heritage.",
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
      url: `${siteUrl}/${locale}/about`,
      siteName: "Filali Adib - Artiste Joaillier",
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Filali Adib - About",
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/about`,
      languages: {
        ar: `${siteUrl}/ar/about`,
        fr: `${siteUrl}/fr/about`,
        en: `${siteUrl}/en/about`,
      },
    },
  };
}

export default function AboutPage() {
  return <AboutPageContent />;
}
