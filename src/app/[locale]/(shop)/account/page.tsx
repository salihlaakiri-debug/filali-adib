"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { User, Package, Heart, MapPin, LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

type Tab = "profile" | "orders" | "favorites" | "addresses";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { quantity: number; product: { name: string } }[];
}

export default function AccountPage() {
  const { data: session, status, update } = useSession();
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const router = useRouter();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push(L("/login"));
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
      });
    }
  }, [session]);

  useEffect(() => {
    if (activeTab === "orders") {
      setLoadingOrders(true);
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="text-gold animate-spin" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: "profile", label: "الملف الشخصي", icon: User },
    { key: "orders", label: "طلباتي", icon: Package },
    { key: "favorites", label: "المفضلة", icon: Heart },
    { key: "addresses", label: "عناويني", icon: MapPin },
  ];

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: "جديد", color: "bg-gray-100 text-gray-700" },
    CONFIRMED: { label: "مؤكد", color: "bg-blue-100 text-blue-700" },
    PROCESSING: { label: "قيد التنفيذ", color: "bg-yellow-100 text-yellow-700" },
    SHIPPED: { label: "جاري الشحن", color: "bg-blue-100 text-blue-700" },
    DELIVERED: { label: "مكتمل", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "ملغي", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="bg-light min-h-[60vh] py-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-playfair text-3xl font-bold text-secondary mb-8">حسابي</motion.h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold">{profile.name?.charAt(0) || "?"}</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-secondary">{profile.name}</p>
                  <p className="text-xs text-gray-500">{profile.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.key ? "bg-gold/10 text-gold" : "text-gray-600 hover:bg-gray-50"
                    }`}>
                    <tab.icon size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 my-2" />
                <button onClick={() => signOut({ callbackUrl: L("/") })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={18} /> <span className="text-sm font-medium">تسجيل الخروج</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <FadeIn>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-semibold text-secondary text-lg mb-6">الملف الشخصي</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">الاسم</label>
                      <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">البريد الإلكتروني</label>
                      <input type="email" value={profile.email} disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">رقم الهاتف</label>
                      <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+212 60000000" dir="ltr"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={saving}
                      onClick={async () => { setSaving(true); addToast("تم حفظ التغييرات"); setSaving(false); }}
                      className="bg-gold text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all flex items-center gap-2">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : null} حفظ التغييرات
                    </motion.button>
                  </div>
                </div>
              </FadeIn>
            )}

            {activeTab === "orders" && (
              <FadeIn>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-semibold text-secondary text-lg mb-6">طلباتي</h2>
                  {loadingOrders ? (
                    <div className="flex justify-center py-8"><Loader2 size={24} className="text-gold animate-spin" /></div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">لا توجد طلبات بعد</p>
                      <button onClick={() => router.push(L("/products"))} className="bg-gold text-secondary px-6 py-2 rounded-lg font-medium">
                        تصفح المنتجات
                      </button>
                    </div>
                  ) : (
                    <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                      {orders.map((order) => {
                        const status = statusLabels[order.status] || statusLabels.PENDING;
                        return (
                          <StaggerItem key={order.id}>
                            <motion.div whileHover={{ y: -2 }} className="border border-gray-100 rounded-lg p-4 transition-all">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{order.orderNumber}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{new Date(order.createdAt).toLocaleDateString("ar-MA")}</p>
                              {order.items.map((item, i) => (
                                <p key={i} className="text-gray-600 text-sm">{item.product.name} x {item.quantity}</p>
                              ))}
                              <p className="font-bold text-gold mt-2">{order.total.toLocaleString()} د.م</p>
                            </motion.div>
                          </StaggerItem>
                        );
                      })}
                    </StaggerContainer>
                  )}
                </div>
              </FadeIn>
            )}

            {activeTab === "favorites" && (
              <FadeIn>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center py-16">
                  <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لم تقم بإضافة أي منتجات للمفضلة بعد</p>
                </div>
              </FadeIn>
            )}

            {activeTab === "addresses" && (
              <FadeIn>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-secondary text-lg">عناويني</h2>
                    <button className="bg-gold text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-dark transition-all">
                      إضافة عنوان
                    </button>
                  </div>
                  <div className="text-center py-8">
                    <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد عناوين محفوظة</p>
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
