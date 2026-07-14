"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { DollarSign, Save, Loader2, Calculator, TrendingUp } from "lucide-react";
import { AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

export default function AdminPricingPage() {
  const locale = useLocale();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [goldPrices, setGoldPrices] = useState<Record<string, number>>({ K18: 1100, K21: 1300, K24: 1500 });
  const [margins, setMargins] = useState<{ id?: string; categoryId: string; categoryName: string; margin: number }[]>([]);
  const [calcCategory, setCalcCategory] = useState(0);
  const [calcWeight, setCalcWeight] = useState(10);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((d) => {
        const prices: Record<string, number> = { K18: 1100, K21: 1300, K24: 1500 };
        d.goldPrices?.forEach((p: any) => { if (p.karat) prices[p.karat] = Number(p.price); });
        setGoldPrices(prices);

        const cats = d.categories || [];
        const existingMargins = d.margins || [];
        setMargins(cats.map((c: any) => {
          const existing = existingMargins.find((m: any) => m.categoryId === c.id);
          return { id: existing?.id, categoryId: c.id, categoryName: c.name, margin: existing ? Number(existing.margin) : 200 };
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const saveGoldPrices = async () => {
    setSaving("gold");
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "goldPrice", prices: Object.entries(goldPrices).map(([karat, price]) => ({ karat, price })) }),
      });
      if (!res.ok) throw new Error();
      addToast(locale === "ar" ? "تم حفظ أسعار الذهب" : "Gold prices saved");
    } catch { addToast(locale === "ar" ? "خطأ" : "Error"); }
    setSaving("");
  };

  const saveMargins = async () => {
    setSaving("margins");
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "margins", margins: margins.map((m) => ({ id: m.id, categoryId: m.categoryId, margin: m.margin })) }),
      });
      if (!res.ok) throw new Error();
      addToast(locale === "ar" ? "تم حفظ هامش الربح" : "Margins saved");
    } catch { addToast(locale === "ar" ? "خطأ" : "Error"); }
    setSaving("");
  };

  if (loading) return <AdminLoading />;

  const calcPrice = margins[calcCategory]
    ? (goldPrices.K18 + margins[calcCategory].margin) * calcWeight
    : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-bold text-secondary">{locale === "ar" ? "التسعير" : "Pricing"}</h1>

      {/* Gold Price */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
            <DollarSign size={20} className="text-gold" />
          </div>
          <div>
            <h2 className="font-semibold text-secondary">{locale === "ar" ? "أسعار الذهب" : "Gold Prices"}</h2>
            <p className="text-xs text-gray-400">{locale === "ar" ? "درهم مغربي لكل غرام" : "Moroccan Dirham per gram"}</p>
          </div>
        </div>
        <div className="space-y-3">
          {(["K18", "K21", "K24"] as const).map((karat) => (
            <div key={karat} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <span className={`text-sm font-bold min-w-[40px] px-2 py-1 rounded-lg text-center ${
                karat === "K18" ? "bg-gold/10 text-gold" : karat === "K21" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
              }`}>{karat}</span>
              <div className="flex-1">
                <input type="number" value={goldPrices[karat]} onChange={(e) => setGoldPrices((p) => ({ ...p, [karat]: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
              </div>
              <span className="text-xs text-gray-500">د.م/غ</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveGoldPrices} disabled={saving === "gold"}
            className="flex items-center gap-2 bg-gold text-secondary px-6 py-3 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors disabled:opacity-50 shadow-sm">
            {saving === "gold" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {locale === "ar" ? "حفظ الأسعار" : "Save Prices"}
          </motion.button>
        </div>
      </div>

      {/* Profit Margins */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-gold" />
            </div>
            <div>
              <h2 className="font-semibold text-secondary">{locale === "ar" ? "هامش الربح حسب التصنيف" : "Profit Margins by Category"}</h2>
              <p className="text-xs text-gray-400">{locale === "ar" ? "د.م لكل غرام" : "MAD per gram"}</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveMargins} disabled={saving === "margins"}
            className="flex items-center gap-2 bg-gold text-secondary px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors disabled:opacity-50 shadow-sm">
            {saving === "margins" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {locale === "ar" ? "حفظ الهوامش" : "Save Margins"}
          </motion.button>
        </div>
        <div className="space-y-3">
          {margins.map((m, i) => (
            <div key={m.categoryId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-sm font-medium text-secondary min-w-[120px]">{m.categoryName}</span>
              <input type="number" value={m.margin}
                onChange={(e) => setMargins((prev) => prev.map((p, idx) => idx === i ? { ...p, margin: parseFloat(e.target.value) || 0 } : p))}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold text-center font-medium" />
              <span className="text-xs text-gray-500">د.م/غ</span>
              <div className="flex-1" />
              <span className="text-sm text-gray-500">
                {locale === "ar" ? "السعر:" : "Price:"} <span className="font-medium text-secondary">{(goldPrices.K18 + m.margin).toLocaleString()} د.م/غ</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Calculator */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
            <Calculator size={20} className="text-gold" />
          </div>
          <h2 className="font-semibold text-secondary">{locale === "ar" ? "حاسبة الأسعار" : "Price Calculator"}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "التصنيف" : "Category"}</label>
            <select value={calcCategory} onChange={(e) => setCalcCategory(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold">
              {margins.map((m, i) => <option key={m.categoryId} value={i}>{m.categoryName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الوزن (غ)" : "Weight (g)"}</label>
            <input type="number" value={calcWeight} onChange={(e) => setCalcWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
          </div>
        </div>
        <div className="p-4 bg-gold/5 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">{locale === "ar" ? "الصيغة" : "Formula"}</p>
          <p className="text-sm font-mono text-secondary mb-2">({goldPrices.K18} + {margins[calcCategory]?.margin || 0}) × {calcWeight}g</p>
          <p className="text-2xl font-bold text-gold">{calcPrice.toLocaleString()} د.م</p>
        </div>
      </div>
    </div>
  );
}
