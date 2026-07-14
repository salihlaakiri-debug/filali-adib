"use client";

import { useTranslations } from "next-intl";
import { Award, Gem, Handshake } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/motion";
import { motion } from "framer-motion";

export function AboutSection() {
  const t = useTranslations("home.about");

  const features = [
    { icon: Gem, title: t("features.quality") },
    { icon: Award, title: t("features.expertise") },
    { icon: Handshake, title: t("features.trust") },
  ];

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-secondary mb-4 line-gold inline-block pb-2">
                {t("title")}
              </h2>
              <p className="text-gold font-medium mb-4 mt-8">{t("subtitle")}</p>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                {t("description")}
              </p>

              <StaggerContainer className="grid grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <StaggerItem key={index} direction="up">
                    <div className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors hover:bg-gold/20"
                      >
                        <feature.icon className="text-gold" size={24} />
                      </motion.div>
                      <p className="text-sm text-secondary font-medium">
                        {feature.title}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>

          <FadeIn direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                  alt="Filali Adib - Artiste Joaillier"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-8 -left-8 bg-secondary text-white p-6 rounded-2xl shadow-2xl border border-gold/20"
              >
                <p className="font-playfair text-4xl font-bold text-gold">
                  <AnimatedCounter target={40} prefix="+" />
                </p>
                <p className="text-sm text-gray-300">{t("yearsLabel")}</p>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
