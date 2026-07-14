"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useTranslations } from "next-intl";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
}

function useCounterAnimation(target: number, decimals: number = 0, duration: number = 2.5) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    if (decimals > 0) return latest.toFixed(decimals);
    return Math.round(latest).toLocaleString();
  });
  const [displayValue, setDisplayValue] = useState(decimals > 0 ? "0.0" : "0");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.25, 0.4, 0.25, 1],
    });
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, target, duration, motionValue, rounded]);

  return { ref, displayValue, isInView };
}

function AnimatedStat({ stat, index }: { stat: StatItem; index: number }) {
  const { ref, displayValue, isInView } = useCounterAnimation(stat.target, stat.decimals ?? 0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      className="relative flex flex-col items-center text-center px-6 py-8 group"
    >
      <p className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-3 tracking-tight">
        {displayValue}{stat.suffix}
      </p>
      <p className="text-gray-300 text-sm md:text-base font-medium tracking-wide">
        {stat.label}
      </p>
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent w-16"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
      />
    </motion.div>
  );
}

function RotatingDiamond({ duration = 20, size = 14 }: { duration?: number; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" />
    </motion.svg>
  );
}

const defaultStats: StatItem[] = [
  { target: 40, suffix: "+", label: "سنوات من الخبرة" },
  { target: 50000, suffix: "+", label: "عميل سعيد" },
  { target: 10000, suffix: "+", label: "منتج تم بيعه" },
  { target: 4.9, suffix: "", label: "تقييم العملاء", decimals: 1 },
];

function tOrDefault(t: ReturnType<typeof useTranslations>, key: string, fallback: string) {
  try {
    return t(key);
  } catch {
    return fallback;
  }
}

export function StatsSection() {
  const t = useTranslations("home.stats");
  const stats: StatItem[] = [
    { target: 40, suffix: "+", label: tOrDefault(t, "years", defaultStats[0].label) },
    { target: 50000, suffix: "+", label: tOrDefault(t, "customers", defaultStats[1].label) },
    { target: 10000, suffix: "+", label: tOrDefault(t, "products", defaultStats[2].label) },
    { target: 4.9, suffix: "", label: tOrDefault(t, "rating", defaultStats[3].label), decimals: 1 },
  ];

  return (
    <section className="relative py-20 md:py-28 px-4 overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.04)_0%,transparent_50%)]" />

      <motion.div
        className="absolute top-8 left-[10%] text-gold/10 hidden lg:block"
        animate={{ y: [-8, 8, -8], rotate: [0, 180, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <RotatingDiamond size={18} duration={15} />
      </motion.div>
      <motion.div
        className="absolute bottom-12 right-[12%] text-gold/8 hidden lg:block"
        animate={{ y: [8, -8, 8], rotate: [360, 180, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        <RotatingDiamond size={14} duration={22} />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-[5%] -translate-y-1/2 text-gold/6 hidden xl:block"
        animate={{ y: [-5, 5, -5], rotate: [0, 90, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <RotatingDiamond size={10} />
      </motion.div>
      <motion.div
        className="absolute top-[30%] right-[6%] text-gold/7 hidden xl:block"
        animate={{ y: [6, -6, 6], rotate: [0, -180, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <RotatingDiamond size={12} duration={18} />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <AnimatedStat stat={stat} index={index} />
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
              )}
              {index % 2 === 0 && index < stats.length - 1 && (
                <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
