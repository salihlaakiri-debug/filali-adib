"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Save, Loader2, Store, Truck, Receipt } from "lucide-react";
import { AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const locale = useLocale();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "", storeEmail: "", storePhone: "", currency: "MAD",
    shippingLocal: 150, freeShippingAbove: 5000, shippingInternational: 500, minInternationalOrder: 10000,
    taxRate: 20, taxId: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => {
      if (d.settings) setSettings(d.settings);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (!res.ok) throw new Error();
      addToast(locale === "ar" ? "تم حفظ الإعدادات" : "Settings saved");
    } catch { addToast(locale === "ar" ? "خطأ" : "Error"); }
    setSaving(false);
  };

  if (loading) return <AdminLoading />;

  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-secondary">{t("الإعدادات", "Settings")}</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gold text-secondary px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors disabled:opacity-50 shadow-sm">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {t("حفظ", "Save")}
        </motion.button>
      </div>

      {/* Store Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center"><Store size={20} className="text-gold" /></div>
          <h2 className="font-semibold text-secondary">{t("معلومات المتجر", "Store Info")}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: t("اسم المتجر", "Store Name"), key: "storeName" },
            { label: t("البريد الإلكتروني", "Email"), key: "storeEmail", type: "email" },
            { label: t("الهاتف", "Phone"), key: "storePhone", type: "tel" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
              <input type={f.type || "text"} value={(settings as any)[f.key]}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t("العملة", "Currency")}</label>
            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold">
              <option value="MAD">MAD - {t("درهم مغربي", "Dirham")}</option>
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center"><Truck size={20} className="text-gold" /></div>
          <h2 className="font-semibold text-secondary">{t("إعدادات الشحن", "Shipping")}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: t("رسوم الشحن المحلي (د.م)", "Local Shipping (MAD)"), key: "shippingLocal" },
            { label: t("شحن مجاني فوق (د.م)", "Free Above (MAD)"), key: "freeShippingAbove" },
            { label: t("رسوم الشحن الدولي (د.م)", "International (MAD)"), key: "shippingInternational" },
            { label: t("الحد الأدنى الدولي (د.م)", "Min International (MAD)"), key: "minInternationalOrder" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
              <input type="number" value={(settings as any)[f.key]}
                onChange={(e) => setSettings({ ...settings, [f.key]: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Tax */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center"><Receipt size={20} className="text-gold" /></div>
          <h2 className="font-semibold text-secondary">{t("الضرائب", "Tax")}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t("نسبة الضريبة (%)", "Tax Rate (%)")}</label>
            <input type="number" value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t("رقم التعريف الضريبي", "Tax ID")}</label>
            <input type="text" value={settings.taxId}
              onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
