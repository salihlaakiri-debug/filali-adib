import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ContactPageContent } from "./ContactPageContent";

const siteUrl = "https://filali-adib.vercel.app";

const metaByLocale: Record<string, { title: string; description: string }> = {
  ar: {
    title: "اتصل بنا | فيلالي عديب - حرفي مجوهرات",
    description: "تواصل مع فيلالي عديب في فاس، المغرب. العنوان، الهاتف، البريد الإلكتروني، وساعات العمل. واتساب متاح للاستفسارات السريعة.",
  },
  fr: {
    title: "Contact | Filali Adib - Artiste Joaillier",
    description: "Contactez Filali Adib à Fès, Maroc. Adresse, téléphone, email et horaires d'ouverture. WhatsApp disponible pour vos questions.",
  },
  en: {
    title: "Contact | Filali Adib - Master Jeweler",
    description: "Contact Filali Adib in Fes, Morocco. Address, phone, email, and business hours. WhatsApp available for quick inquiries.",
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
      url: `${siteUrl}/${locale}/contact`,
      siteName: "Filali Adib - Artiste Joaillier",
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Filali Adib - Contact",
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/contact`,
      languages: {
        ar: `${siteUrl}/ar/contact`,
        fr: `${siteUrl}/fr/contact`,
        en: `${siteUrl}/en/contact`,
      },
    },
  };
}

export default function ContactPage() {
  return <ContactPageContent />;
}
