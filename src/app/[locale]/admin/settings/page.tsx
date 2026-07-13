"use client";

import { Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";
import { useState } from "react";

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "Filali Adib - Artiste Joaillier",
    storeEmail: "contact@filaliadib.com",
    storePhone: "+212 522-123456",
    currency: "MAD",
    shippingLocal: 150,
    freeShippingAbove: 5000,
    shippingInternational: 500,
    minInternationalOrder: 10000,
    taxRate: 20,
    taxId: "12345678",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      addToast("تم حفظ الإعدادات بنجاح");
    } catch { addToast("حدث خطأ أثناء الحفظ"); } finally { setSaving(false); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
          className="bg-gold text-secondary px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} حفظ
        </motion.button>
      </motion.div>

      <StaggerContainer className="space-y-6" staggerDelay={0.12}>
        <StaggerItem>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات المتجر</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "اسم المتجر", key: "storeName" },
                { label: "البريد الإلكتروني", key: "storeEmail", type: "email" },
                { label: "الهاتف", key: "storePhone", type: "tel" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                  <input type={field.type || "text"} value={(settings as any)[field.key]}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-sm text-gray-600 mb-1">العملة</label>
                <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold">
                  <option value="MAD">درهم مغربي (MAD)</option><option value="EUR">يورو (EUR)</option><option value="USD">دولار (USD)</option>
                </select>
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">إعدادات الشحن</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "رسوم الشحن المحلي", key: "shippingLocal" },
                { label: "شحن مجاني فوق", key: "freeShippingAbove" },
                { label: "رسوم الشحن الدولي", key: "shippingInternational" },
                { label: "الحد الأدنى للشحن الدولي", key: "minInternationalOrder" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                  <input type="number" value={(settings as any)[field.key]}
                    onChange={(e) => setSettings({ ...settings, [field.key]: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">الضرائب</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">نسبة الضريبة (%)</label>
                <input type="number" value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">رقم التعريف الضريبي</label>
                <input type="text" value={settings.taxId}
                  onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
              </div>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
