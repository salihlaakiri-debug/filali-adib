"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Save, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

interface GoldPrice { id: string; karat: string; price: number; }
interface Margin { id: string; categoryId: string | null; margin: number; }

export default function AdminPricingPage() {
  const t = useTranslations("admin.pricing");
  const { addToast } = useToast();
  const [goldPrices, setGoldPrices] = useState<Record<string, { id: string; price: number }>>({});
  const [profitMargins, setProfitMargins] = useState<Record<string, { id: string; margin: number }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calcKarat, setCalcKarat] = useState("K21");
  const [calcCategory, setCalcCategory] = useState("rings");
  const [calcWeight, setCalcWeight] = useState(5);

  const categoryNames: Record<string, string> = { rings: "خواتم", necklaces: "سلاسل", earrings: "أقراط", bracelets: "أساور", sets: "أطقم" };

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data) => {
        const prices: Record<string, { id: string; price: number }> = {};
        (data.goldPrices || []).forEach((p: GoldPrice) => { prices[p.karat] = { id: p.id, price: p.price }; });
        if (!prices.K18) prices.K18 = { id: "", price: 1100 };
        if (!prices.K21) prices.K21 = { id: "", price: 1300 };
        if (!prices.K24) prices.K24 = { id: "", price: 1500 };
        setGoldPrices(prices);

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
        setGoldPrices({ K18: { id: "", price: 1100 }, K21: { id: "", price: 1300 }, K24: { id: "", price: 1500 } });
        setProfitMargins({ rings: { id: "", margin: 200 }, necklaces: { id: "", margin: 250 }, earrings: { id: "", margin: 180 }, bracelets: { id: "", margin: 220 }, sets: { id: "", margin: 300 } });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [karat, data] of Object.entries(goldPrices)) {
        await fetch("/api/admin/pricing", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "goldPrice", karat, price: data.price }),
        });
      }
      addToast("تم حفظ الأسعار بنجاح");
    } catch { addToast("حدث خطأ أثناء الحفظ"); } finally { setSaving(false); }
  };

  const calcPrice = () => {
    const goldPrice = goldPrices[calcKarat]?.price || 0;
    const margin = profitMargins[calcCategory]?.margin || 0;
    return (goldPrice + margin) * calcWeight;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 size={32} className="text-gold animate-spin" /></div>;
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
          className="bg-gold text-secondary px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} حفظ التغييرات
        </motion.button>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <FadeIn direction="right">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">{t("goldPrice")}</h2>
            <StaggerContainer className="space-y-4" staggerDelay={0.1}>
              {Object.entries(goldPrices).map(([karat, data]) => (
                <StaggerItem key={karat}>
                  <motion.div whileHover={{ x: 4 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all">
                    <div>
                      <p className="font-medium text-gray-800">{karat === "K18" ? "عيار 18" : karat === "K21" ? "عيار 21" : "عيار 24"}</p>
                      <p className="text-sm text-gray-500">سعر الغرام الواحد</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" value={data.price} onChange={(e) => setGoldPrices({ ...goldPrices, [karat]: { ...data, price: Number(e.target.value) } })}
                        className="w-32 px-4 py-2 border border-gray-200 rounded-lg text-right focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      <span className="text-gray-500">د.م/غ</span>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <div className="mt-4 p-4 bg-gold/10 rounded-lg">
              <p className="text-sm text-gray-600">آخر تحديث: {new Date().toLocaleDateString("ar-MA")}</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="left" delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">{t("profitMargin")}</h2>
            <StaggerContainer className="space-y-4" staggerDelay={0.1}>
              {Object.entries(profitMargins).map(([category, data]) => (
                <StaggerItem key={category}>
                  <motion.div whileHover={{ x: 4 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all">
                    <div>
                      <p className="font-medium text-gray-800">{categoryNames[category] || category}</p>
                      <p className="text-sm text-gray-500">هامش الربح لكل غرام</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" value={data.margin} onChange={(e) => setProfitMargins({ ...profitMargins, [category]: { ...data, margin: Number(e.target.value) } })}
                        className="w-32 px-4 py-2 border border-gray-200 rounded-lg text-right focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      <span className="text-gray-500">د.م/غ</span>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>
      </div>

      <FadeIn direction="up" delay={0.2}>
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">حاسبة الأسعار</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">العيار</label>
              <select value={calcKarat} onChange={(e) => setCalcKarat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold">
                <option value="K18">عيار 18</option><option value="K21">عيار 21</option><option value="K24">عيار 24</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">الفئة</label>
              <select value={calcCategory} onChange={(e) => setCalcCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold">
                {Object.entries(categoryNames).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">الوزن (غ)</label>
              <input type="number" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">السعر النهائي</label>
              <div className="w-full px-4 py-2 bg-gold/10 rounded-lg font-bold text-gold text-lg">
                {calcPrice().toLocaleString()} د.م
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600"><strong>المعادلة:</strong> السعر النهائي = (سعر الذهب + هامش الربح) x الوزن</p>
            <p className="text-sm text-gray-600 mt-1"><strong>مثال:</strong> ({goldPrices[calcKarat]?.price?.toLocaleString()} + {profitMargins[calcCategory]?.margin?.toLocaleString()}) x {calcWeight} = {calcPrice().toLocaleString()} د.م</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
