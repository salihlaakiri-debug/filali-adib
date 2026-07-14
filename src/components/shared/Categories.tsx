"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { RingIcon, NecklaceIcon, EarringIcon, BraceletIcon, CrownIcon, DiamondIcon } from "@/components/icons";

const categories = [
  { id: 1, name: "خواتم", nameFr: "Bagues", slug: "rings", Icon: RingIcon, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80", count: 45 },
  { id: 2, name: "سلاسل", nameFr: "Colliers", slug: "necklaces", Icon: NecklaceIcon, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80", count: 32 },
  { id: 3, name: "أقراط", nameFr: "Boucles d'oreilles", slug: "earrings", Icon: EarringIcon, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80", count: 28 },
  { id: 4, name: "أساور", nameFr: "Bracelets", slug: "bracelets", Icon: BraceletIcon, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80", count: 24 },
  { id: 5, name: "أطقم", nameFr: "Parures", slug: "sets", Icon: CrownIcon, image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80", count: 15 },
  { id: 6, name: "مجوهرات خاصة", nameFr: "Bijoux spéciaux", slug: "special", Icon: DiamondIcon, image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&q=80", count: 12 },
];

export function Categories() {
  const t = useTranslations("home.categories");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  return (
    <section className="py-24 px-4 bg-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/[0.02] rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <FadeIn direction="up" className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold/60">
              <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
            </svg>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
          </motion.div>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-secondary mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-500 mt-6 max-w-lg mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category) => (
            <StaggerItem key={category.id}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Link
                  href={L(`/products?category=${category.slug}`)}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500 border border-gray-100 hover:border-gold/20"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Multi-layer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                      <h3 className="font-bold text-sm leading-tight">{category.name}</h3>
                      <p className="text-xs opacity-70 mt-0.5">{category.nameFr}</p>
                    </div>

                    {/* Hover icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-secondary shadow-2xl shadow-gold/30 backdrop-blur-sm"
                      >
                        <category.Icon size={24} />
                      </motion.div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  </div>

                  <div className="px-3 py-3 text-center">
                    <span className="text-xs text-gold font-semibold group-hover:text-gold-dark transition-colors">
                      {category.count} {locale === "ar" ? "منتج" : "produits"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
