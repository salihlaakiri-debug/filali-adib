"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function GoldParticles() {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/20"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90 flex items-center justify-center text-center px-4 overflow-hidden"
    >
      <GoldParticles />

      {/* Decorative rings */}
      <motion.div
        className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[2px] border-gold/10 rounded-full hidden lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[320px] h-[320px] border-[1px] border-gold/8 rounded-full hidden lg:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-[-100px] top-1/4 w-[250px] h-[250px] border-[1px] border-gold/6 rounded-full hidden lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-6"
        >
          <div className="inline-block px-4 py-1.5 border border-gold/30 rounded-full text-gold-light text-sm tracking-wider mb-6">
            ARTISTE JOAILLIER DEPUIS 2005
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-gold mb-4 leading-tight"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="font-playfair text-xl md:text-2xl text-gold-light mb-6 tracking-wider"
        >
          {t("subtitle")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/products"
              className="bg-gold text-secondary px-10 py-4 rounded-full font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20 hover:shadow-gold/40 inline-flex items-center gap-2"
            >
              {t("shopNow")}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/about"
              className="border-2 border-gold/50 text-gold px-10 py-4 rounded-full font-semibold hover:bg-gold/10 hover:border-gold transition-all inline-flex items-center gap-2"
            >
              {t("learnMore")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-light to-transparent" />
    </section>
  );
}
