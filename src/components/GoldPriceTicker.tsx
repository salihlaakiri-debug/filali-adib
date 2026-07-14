"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Diamond, RefreshCw, Clock, Info } from "lucide-react";

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
  const [showDetail, setShowDetail] = useState(false);

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
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !price) return null;

  const isUp = (price.change || 0) >= 0;

  return (
    <div className="bg-secondary text-white text-sm relative overflow-hidden">
      {/* Scrolling background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(212,175,55,0.5) 100px, rgba(212,175,55,0.5) 101px)"
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-2.5 gap-4">
          {/* Left: Brand + Title */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex-shrink-0"
            >
              <Diamond size={16} className="text-gold" />
            </motion.div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gold font-bold text-xs tracking-wider uppercase">
                سعر الذهب اليوم
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400 text-xs">
                عيار 18 — المغرب
              </span>
            </div>
          </div>

          {/* Center: Main Price */}
          <div className="flex items-center gap-4">
            <motion.div
              key={price.price18k}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-gold font-bold text-lg sm:text-xl tracking-tight">
                {price.price18k.toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs">د.م/غ</span>
            </motion.div>

            {/* Change indicator */}
            {price.change !== undefined && price.change !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isUp ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              }`}>
                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{isUp ? "+" : ""}{price.changePercent?.toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-gray-500 text-xs">
              <Clock size={12} />
              <span>
                {new Date(price.updatedAt).toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="text-gray-400 hover:text-gold transition-colors"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {/* Detail popup */}
        {showDetail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 py-3"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
              <div className="text-center">
                <p className="text-gray-500 mb-0.5">عيار 18 (75%)</p>
                <p className="text-gold font-bold">{price.price18k.toLocaleString()} د.م/غ</p>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="text-center">
                <p className="text-gray-500 mb-0.5">السعر يشمل</p>
                <p className="text-gray-300 font-medium">الذهب + الصياغة + الربح</p>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="text-center">
                <p className="text-gray-500 mb-0.5">المصدر</p>
                <p className="text-gray-300 font-medium">سعر السوق المغربي</p>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="text-center">
                <p className="text-gray-500 mb-0.5">آخر تحديث</p>
                <p className="text-gray-300 font-medium">
                  {new Date(price.updatedAt).toLocaleDateString("ar-MA", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
