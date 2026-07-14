"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function GoldParticles() {
  const particles = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 4 + 2;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, rgba(212,175,55,${0.3 + Math.random() * 0.4}) 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -(20 + Math.random() * 40), 0],
              x: [0, (Math.random() - 0.5) * 20, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

function DiamondDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gold/40" />
      <svg width="12" height="12" viewBox="0 0 12 12" className="text-gold/60">
        <path d="M6 0L12 6L6 12L0 6Z" fill="currentColor" />
      </svg>
      <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const tt = useTranslations("home.trust");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-[#0d0d0d] to-secondary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
      </motion.div>

      <GoldParticles />

      {/* Decorative rotating rings */}
      <motion.div
        className="absolute right-[-120px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold/8 rounded-full hidden lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-gold/5 rounded-full hidden lg:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-[-120px] top-[30%] w-[300px] h-[300px] border border-gold/4 rounded-full hidden lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating diamond shapes */}
      <motion.div
        className="absolute top-[20%] left-[15%] hidden lg:block"
        animate={{ y: [-10, 10, -10], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" className="text-gold/15">
          <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-[25%] right-[12%] hidden lg:block"
        animate={{ y: [10, -10, 10], rotate: [45, 0, 45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" className="text-gold/10">
          <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div style={{ y: textY, opacity }} className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 border border-gold/20 rounded-full text-gold-light text-xs tracking-[3px] uppercase backdrop-blur-sm bg-white/5">
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-gold">
              <path d="M4 0L8 4L4 8L0 4Z" fill="currentColor" />
            </svg>
            ARTISTE JOAILLIER DEPUIS 1985
            <svg width="8" height="8" viewBox="0 0 8 8" className="text-gold">
              <path d="M4 0L8 4L4 8L0 4Z" fill="currentColor" />
            </svg>
          </div>
        </motion.div>

        {/* Title with letter animation */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
        >
          <span className="text-gradient-gold">{t("title")}</span>
        </motion.h1>

        <DiamondDivider />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-playfair text-xl md:text-2xl text-gold-light/80 mb-6 tracking-wider"
        >
          {t("subtitle")}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {t("description")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={L("/products")}
              className="group bg-gold text-secondary px-10 py-4 rounded-full font-semibold hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/40 inline-flex items-center gap-3"
            >
              {t("shopNow")}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={L("/about")}
              className="border border-gold/30 text-gold px-10 py-4 rounded-full font-semibold hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 inline-flex items-center gap-2 backdrop-blur-sm"
            >
              {t("learnMore")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-8 text-gray-500 text-xs"
        >
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/60">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{tt("authenticity.title")}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/60">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{tt("shipping.title")}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold/60">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{tt("return.title")}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-light via-light/50 to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gold/30 rounded-full flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-gold rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
