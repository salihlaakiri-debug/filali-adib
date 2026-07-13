"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GoldPrice {
  price24k: number;
  price21k: number;
  price18k: number;
  currency: string;
  updatedAt: string;
}

export function GoldPriceTicker() {
  const [prices, setPrices] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gold-price")
      .then((r) => r.json())
      .then((data) => { setPrices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !prices) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary/95 text-white text-sm overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 py-2 flex-wrap">
          <span className="text-gold text-xs font-bold tracking-wider uppercase">سعر الذهب اليوم</span>
          <span className="text-gray-400">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-xs">24 عيار</span>
            <span className="text-gold font-bold">{prices.price24k.toLocaleString()} د.م/غ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-xs">21 عيار</span>
            <span className="text-white font-bold">{prices.price21k.toLocaleString()} د.م/غ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-xs">18 عيار</span>
            <span className="text-white font-bold">{prices.price18k.toLocaleString()} د.م/غ</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500 text-xs">
            آخر تحديث: {new Date(prices.updatedAt).toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
