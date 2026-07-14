"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Diamond } from "lucide-react";

interface GoldPrice {
  price18k: number;
  pricePerGram: number;
  currency: string;
  updatedAt: string;
  change?: number;
  changePercent?: number;
}

export function GoldPriceTicker() {
  const [price, setPrice] = useState<GoldPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gold-price")
      .then((r) => r.json())
      .then((data) => {
        setPrice({
          price18k: data.price18k,
          pricePerGram: data.price18k,
          currency: data.currency || "MAD",
          updatedAt: data.updatedAt,
          change: data.change || 0,
          changePercent: data.changePercent || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !price) return null;

  const isUp = (price.change || 0) >= 0;

  return (
    <div className="bg-secondary border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 py-1.5 text-xs">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Diamond size={10} className="text-gold" />
          </motion.div>
          <span className="text-gold/80 font-medium">سعر الذهب</span>
          <span className="text-gray-600">|</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={price.price18k}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold font-bold"
            >
              {price.price18k.toLocaleString()} د.م/غ
            </motion.span>
          </AnimatePresence>
          <span className="text-gray-600">|</span>
          <span className="text-gray-500">عيار 18</span>
          {price.change !== undefined && price.change !== 0 && (
            <span className={`flex items-center gap-0.5 ${isUp ? "text-green-400" : "text-red-400"}`}>
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{isUp ? "+" : ""}{price.changePercent?.toFixed(1)}%</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
