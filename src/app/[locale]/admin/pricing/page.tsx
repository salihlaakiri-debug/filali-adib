"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { Save, Loader2, Calculator, Info } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

interface GoldPrice { id: string; karat: string; price: number; }
interface Margin { id: string; categoryId: string | null; margin: number; }

export default function AdminPricingPage() {
  const t = useTranslations("admin.pricing");
  const locale = useLocale();
  const { addToast } = useToast();
  const [goldPrice, setGoldPrice] = useState<{ id: string; price: number }>({ id: "", price: 1100 });
  const [profitMargins, setProfitMargins] = useState<Record<string, { id: string; margin: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calcCategory, setCalcCategory] = useState("rings");
  const [calcWeight, setCalcWeight] = useState(5);

  const categoryNames: Record<string, string> = {
    rings: locale === "ar" ? "خواتم" : "Bagues",
    necklaces: locale === "ar" ? "سلاسل" : "Colliers",
    earrings: locale === "ar" ? "أقراط" : "Boucles d'oreilles",
    bracelets: locale === "ar" ? "أساور" : "Bracelets",
    sets: locale === "ar" ? "أطقم" : "Parures",
  };

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data) => {
        const k18 = (data.goldPrices || []).find((p: GoldPrice) => p.karat === "K18");
        setGoldPrice(k18 ? { id: k18.id, price: k18.price } : { id: "", price: 1100 });

        const margins: Record<string, { id: string; margin: number }> = {};
        (data.margins || []).forEach((m: Margin, i: number) => {
          const cats = ["rings", "necklaces", "earrings", "bracelets", "sets"];
          margins[cats[i] || `cat${i}`] = { id: m.id, margin: m.margin };
        });
        if (!margins.rings) margins.rings = { id: "", margin: 200 };
        if (!margins.necklaces) margins.necklaces = { id: "", margin: 250 };
        if (!margins.earrings) margins.earrings = { id: "", margin: 180 };
        if (!margins.bracelets) margins.bracelets = { id: "", margin: 220 };
        if (!margins.sets) margins.sets = { id: "", margin: 300 };
        setProfitMargins(margins);
      })
      .catch(() => {
        setGoldPrice({ id: "", price: 1100 });
        setProfitMargins({ rings: { id: "", margin: 200 }, necklaces: { id: "", margin: 250 }, earrings: { id: "", margin: 180 }, bracelets: { id: "", margin: 220 }, sets: { id: "", margin: 300 } });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "goldPrice", karat: "K18", price: goldPrice.price }),
      });
      addToast(locale === "ar" ? "تم حفظ السعر بنجاح" : "Price saved successfully");
    } catch { addToast(locale === "ar" ? "حدث خطأ" : "Error occurred"); } finally { setSaving(false); }
  };

  const calcPrice = () => {
    const margin = profitMargins[calcCategory]?.margin || 0;
    return (goldPrice.price + margin) * calcWeight;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={32} className="text-gold animate-spin" /></div>;
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {locale === "ar" ? "عيار 18 فقط — هو العيار القانوني في المغرب" : "18K only — legal karat in Morocco"}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
          className="bg-gold text-secondary px-5 py-2.5 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {locale === "ar" ? "حفظ التغييرات" : "Save"}
        </motion.button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Gold Price */}
        <FadeIn direction="right">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-50">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                <span className="text-gold font-bold text-sm">18K</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{t("goldPrice")}</h2>
                <p className="text-xs text-gray-500">
                  {locale === "ar" ? "العيار الوحيد القانوني في المغرب" : "The only legal karat in Morocco"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gold/5 rounded-xl mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {locale === "ar" ? "عيار 18 (750/1000)" : "Carat 18 (750/1000)"}
                  </p>
                  <p className="text-sm text-gray-500">{locale === "ar" ? "سعر الغرام الواحد" : "Prix par gramme"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" value={goldPrice.price}
                    onChange={(e) => setGoldPrice({ ...goldPrice, price: Number(e.target.value) })}
                    className="w-36 px-4 py-3 border border-gray-200 rounded-xl text-right focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-lg font-bold" />
                  <span className="text-gray-500 font-medium">د.م/غ</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl flex items-start gap-2">
              <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                {locale === "ar"
                  ? "في المغرب، عيار 18 هو العيار القانوني الوحيد المسموح به للبيع. يعادل 75% ذهب نقدي (750/1000)."
                  : "Au Maroc, le carat 18 est le seul karat légalement vendu. Il équivaut à 75% d'or pur (750/1000)."}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Profit Margins */}
        <FadeIn direction="left" delay={0.1}>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">{t("profitMargin")}</h2>
            <StaggerContainer className="space-y-3" staggerDelay={0.08}>
              {Object.entries(profitMargins).map(([category, data]) => (
                <StaggerItem key={category}>
                  <motion.div whileHover={{ x: 4 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-all">
                    <div>
                      <p className="font-medium text-gray-800">{categoryNames[category] || category}</p>
                      <p className="text-sm text-gray-500">{locale === "ar" ? "هامش الربح لكل غرام" : "Marge par gramme"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" value={data.margin}
                        onChange={(e) => setProfitMargins({ ...profitMargins, [category]: { ...data, margin: Number(e.target.value) } })}
                        className="w-32 px-4 py-2 border border-gray-200 rounded-xl text-right focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      <span className="text-gray-500 text-sm">د.م/غ</span>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>
      </div>

      {/* Calculator */}
      <FadeIn direction="up" delay={0.2}>
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-50">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <Calculator size={20} className="text-gold" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {locale === "ar" ? "حاسبة الأسعار" : "Calculateur de prix"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">{locale === "ar" ? "الفئة" : "Catégorie"}</label>
              <select value={calcCategory} onChange={(e) => setCalcCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-gray-50 focus:bg-white">
                {Object.entries(categoryNames).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">{locale === "ar" ? "الوزن (غ)" : "Poids (g)"}</label>
              <input type="number" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">{locale === "ar" ? "السعر النهائي" : "Prix final"}</label>
              <div className="w-full px-4 py-3 bg-gold/10 rounded-xl font-bold text-gold text-xl text-center">
                {calcPrice().toLocaleString()} د.م
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>{locale === "ar" ? "المعادلة:" : "Formule:"}</strong>{" "}
              {locale === "ar" ? "السعر النهائي = (سعر الذهب + هامش الربح) × الوزن" : "Prix final = (Prix or + Marge) × Poids"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ({goldPrice.price.toLocaleString()} + {profitMargins[calcCategory]?.margin?.toLocaleString()}) × {calcWeight} = {calcPrice().toLocaleString()} د.م
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
