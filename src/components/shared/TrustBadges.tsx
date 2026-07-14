"use client";

import { useTranslations } from "next-intl";
import { Shield, Truck, RotateCcw, Headphones } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { motion } from "framer-motion";

const badges = [
  { key: "authenticity", Icon: Shield },
  { key: "shipping", Icon: Truck },
  { key: "return", Icon: RotateCcw },
  { key: "support", Icon: Headphones },
] as const;

export function TrustBadges() {
  const t = useTranslations("home.trust");

  return (
    <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="max-w-7xl mx-auto relative">
        <FadeIn direction="up" className="text-center mb-14">
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

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map(({ key, Icon }) => (
            <StaggerItem key={key}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="group bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gold/10 transition-all duration-500 hover:border-gold/20"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors duration-300 group-hover:bg-gold/20"
                >
                  <Icon className="text-gold" size={28} />
                </motion.div>
                <h3 className="font-playfair text-lg font-bold text-secondary mb-1">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {t(`${key}.titleFr`)}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(`${key}.description`)}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
