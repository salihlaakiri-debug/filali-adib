import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/shared/Hero";
import { FeaturedProducts } from "@/components/shared/FeaturedProducts";
import { Categories } from "@/components/shared/Categories";
import { AboutSection } from "@/components/shared/AboutSection";
import { StatsSection } from "@/components/shared/StatsSection";
import { Testimonials } from "@/components/shared/Testimonials";
import { TrustBadges } from "@/components/shared/TrustBadges";
import { Newsletter } from "@/components/shared/Newsletter";

const siteUrl = "https://filali-adib.vercel.app";

const metaByLocale: Record<string, { title: string; description: string }> = {
  ar: {
    title: "فيلالي عديب - حرفي مجوهرات | بيع وشراء الذهب في فاس",
    description: "فيلالي عديب - حرفي مجوهرات مغربي بخبرة 40 عاماً في فاس. بيع وشراء الذهب والمجوهرات بأسعار تنافسية وشهادات أصالة.",
  },
  fr: {
    title: "Filali Adib - Artiste Joaillier | Achat et Vente d'Or à Fès",
    description: "Filali Adib - Artisan joaillier marocain avec 40 ans d'expérience à Fès. Achat et vente d'or et de bijoux à des prix compétitifs.",
  },
  en: {
    title: "Filali Adib - Master Jeweler | Gold Trading in Fes, Morocco",
    description: "Filali Adib - Moroccan jewelry artisan with 40 years of experience in Fes. Buy and sell gold and jewelry at competitive prices.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const meta = metaByLocale[locale] || metaByLocale.ar;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: siteUrl,
      siteName: "Filali Adib - Artiste Joaillier",
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Filali Adib - Artiste Joaillier",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${siteUrl}/og-image.png`],
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        ar: `${siteUrl}/ar`,
        fr: `${siteUrl}/fr`,
        en: `${siteUrl}/en`,
      },
    },
  };
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <StatsSection />
      <TrustBadges />
      <AboutSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
