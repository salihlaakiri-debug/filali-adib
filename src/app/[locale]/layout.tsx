import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";

const siteUrl = "https://filali-adib.vercel.app";

const metaByLocale: Record<string, { title: string; description: string }> = {
  ar: {
    title: "فيلالي عديب - حرفي مجوهرات | بيع وشراء الذهب في فاس",
    description: "فيلالي عديب - حرفي مجوهرات مغربي بخبرة 40 عاماً في فاس. بيع وشراء الذهب والمجوهرات بأسعار تنافسية وشهادات أصالة. توصيل مجاني في المغرب.",
  },
  fr: {
    title: "Filali Adib - Artiste Joaillier | Achat et Vente d'Or à Fès",
    description: "Filali Adib - Artisan joaillier marocain avec 40 ans d'expérience à Fès. Achat et vente d'or et de bijoux à des prix compétitifs avec certificats d'authenticité. Livraison gratuite au Maroc.",
  },
  en: {
    title: "Filali Adib - Master Jeweler | Gold Trading in Fes, Morocco",
    description: "Filali Adib - Moroccan jewelry artisan with 40 years of experience in Fes. Buy and sell gold and jewelry at competitive prices with authenticity certificates. Free shipping in Morocco.",
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
    title: {
      default: meta.title,
      template: `%s | فيلالي عديب - Artiste Joaillier`,
    },
    description: meta.description,
    keywords: ["ذهب", "مجوهرات", "فاس", "المغرب", "gold", "jewelry", "Fes", "Morocco", "Filali Adib", "بيع ذهب", "شراء ذهب", "خواتم ذهبية", "قلادات ذهبية"],
    authors: [{ name: "Filali Adib" }],
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_MA" : locale === "fr" ? "fr_MA" : "en_US",
      url: siteUrl,
      siteName: "Filali Adib - Artiste Joaillier",
      title: meta.title,
      description: meta.description,
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        "ar": `${siteUrl}/ar`,
        "fr": `${siteUrl}/fr`,
        "en": `${siteUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              name: "Filali Adib - Artiste Joaillier",
              description: "حرفي مجوهرات مغربي بخبرة 40 عاماً في فاس",
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: "الطالعة الكبيرة 42، فاس المرينية",
                addressLocality: "Fès",
                addressCountry: "MA",
                postalCode: "30000",
              },
              telephone: "+212535630000",
              email: "contact@filaliadib.com",
              priceRange: "$$$$",
              currenciesAccepted: "MAD",
              paymentAccepted: "Cash, Credit Card",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "09:30",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Sunday",
                  opens: "10:00",
                  closes: "14:00",
                },
              ],
              sameAs: [
                "https://www.facebook.com/filaliadib",
                "https://www.instagram.com/filaliadib",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
