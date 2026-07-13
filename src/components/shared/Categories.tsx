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
    <section className="py-20 px-4 bg-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <FadeIn direction="up" className="text-center mb-14">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-secondary mb-4 line-gold inline-block pb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 mt-6">{t("subtitle")}</p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category) => (
            <StaggerItem key={category.id}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Link
                  href={L(`/products?category=${category.slug}`)}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 border border-gray-100"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-sm leading-tight">{category.name}</h3>
                      <p className="text-xs opacity-75 mt-0.5">{category.nameFr}</p>
                    </div>
                    {/* Hover icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-gold/90 rounded-full flex items-center justify-center text-secondary shadow-xl">
                        <category.Icon size={22} />
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <span className="text-xs text-gold font-semibold">{category.count} منتج</span>
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
