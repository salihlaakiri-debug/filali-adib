"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import {
  User, Package, Heart, MapPin, LogOut, Loader2, ShoppingBag, Clock,
  CheckCircle2, Truck, Settings, LayoutDashboard, DollarSign, ShoppingCart,
  Users, Star, Tag, BarChart3, Bell, TrendingUp, AlertTriangle, Eye, FolderTree,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

type Tab = "profile" | "orders" | "favorites" | "addresses";

interface Order {
  id: string; orderNumber: string; status: string; total: number; createdAt: string;
  items: { quantity: number; product: { name: string; images?: { url: string }[] } }[];
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const router = useRouter();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes((session?.user as any)?.role);

  useEffect(() => { if (status === "unauthenticated") router.push(L("/login")); }, [status, router]);
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      setProfile({ name: u.name || "", email: u.email || "", phone: u.phone || "" });
    }
  }, [session]);

  useEffect(() => {
    if (isAdmin) {
      setStatsLoading(true);
      fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => console.warn("Failed to fetch admin stats")).finally(() => setStatsLoading(false));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin && activeTab === "orders") {
      setLoadingOrders(true);
      fetch("/api/orders").then((r) => r.json()).then((d) => setOrders(d.orders || [])).catch(() => setOrders([])).finally(() => setLoadingOrders(false));
    }
  }, [activeTab, isAdmin]);

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 size={32} className="text-gold animate-spin" /></div>;

  // ===========================
  // ADMIN PROFILE
  // ===========================
  if (isAdmin) {
    const adminStats = stats || {};
    const adminLinks = [
      { href: "/admin/dashboard", icon: LayoutDashboard, label: "لوحة التحكم", labelFr: "Dashboard", color: "text-blue-600", bg: "bg-blue-50" },
      { href: "/admin/products", icon: Package, label: "المنتجات", labelFr: "Products", color: "text-green-600", bg: "bg-green-50" },
      { href: "/admin/categories", icon: FolderTree, label: "التصنيفات", labelFr: "Categories", color: "text-teal-600", bg: "bg-teal-50" },
      { href: "/admin/orders", icon: ShoppingCart, label: "الطلبات", labelFr: "Orders", color: "text-purple-600", bg: "bg-purple-50", badge: adminStats.pendingOrders },
      { href: "/admin/customers", icon: Users, label: "العملاء", labelFr: "Customers", color: "text-pink-600", bg: "bg-pink-50" },
      { href: "/admin/reviews", icon: Star, label: "التقييمات", labelFr: "Reviews", color: "text-yellow-600", bg: "bg-yellow-50", badge: adminStats.pendingReviews },
      { href: "/admin/coupons", icon: Tag, label: "الكوبونات", labelFr: "Coupons", color: "text-indigo-600", bg: "bg-indigo-50" },
      { href: "/admin/analytics", icon: BarChart3, label: "التحليلات", labelFr: "Analytics", color: "text-gold", bg: "bg-gold/10" },
      { href: "/admin/pricing", icon: DollarSign, label: "التسعير", labelFr: "Pricing", color: "text-emerald-600", bg: "bg-emerald-50" },
      { href: "/admin/settings", icon: Settings, label: "الإعدادات", labelFr: "Settings", color: "text-gray-600", bg: "bg-gray-100" },
    ];

    return (
      <div className="bg-light min-h-[70vh] py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Admin header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="bg-secondary rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(212,175,55,0.15) 0%, transparent 50%)" }} />
              <div className="relative flex items-center gap-5">
                <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-playfair text-2xl font-bold">{profile.name?.charAt(0) || "A"}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="font-playfair text-2xl font-bold text-white">{profile.name || "Admin"}</h1>
                    <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-medium">ADMIN</span>
                  </div>
                  <p className="text-gray-400 text-sm">{profile.email}</p>
                </div>
                <Link href={L("/admin/dashboard")}
                  className="flex items-center gap-2 bg-gold text-secondary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors shadow-lg shadow-gold/20">
                  <LayoutDashboard size={16} /> {locale === "ar" ? "فتح لوحة التحكم" : "Open Dashboard"}
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {statsLoading ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="text-gold animate-spin" /></div>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" staggerDelay={0.05}>
                {[
                  { icon: DollarSign, label: "الإيرادات", value: `${(adminStats.revenue || 0).toLocaleString()} د.م`, color: "text-green-600", bg: "bg-green-50" },
                  { icon: ShoppingCart, label: "الطلبات", value: adminStats.orders || 0, color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Users, label: "العملاء", value: adminStats.customers || 0, color: "text-purple-600", bg: "bg-purple-50" },
                  { icon: Package, label: "المنتجات", value: adminStats.products || 0, color: "text-pink-600", bg: "bg-pink-50" },
                ].map((s, i) => (
                  <StaggerItem key={i}>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                      <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <s.icon size={20} className={s.color} />
                      </div>
                      <p className="font-bold text-secondary text-lg">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Quick links grid */}
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{locale === "ar" ? "الوصول السريع" : "Quick Access"}</h3>
              <StaggerContainer className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3 mb-8" staggerDelay={0.04}>
                {adminLinks.map((link, i) => (
                  <StaggerItem key={link.href}>
                    <Link href={L(link.href)}
                      className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:shadow-md hover:border-gold/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${link.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <link.icon size={18} className={link.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary group-hover:text-gold transition-colors truncate">
                            {locale === "ar" ? link.label : link.labelFr}
                          </p>
                        </div>
                        {link.badge > 0 && (
                          <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{link.badge}</span>
                        )}
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Pending alerts */}
              {adminStats.pendingOrders > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell size={18} className="text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">{adminStats.pendingOrders} {locale === "ar" ? "طلب في انتظار المراجعة" : "orders awaiting review"}</p>
                    <p className="text-xs text-yellow-600">{locale === "ar" ? "قم بمراجعة الطلبات الجديدة" : "Review new orders"}</p>
                  </div>
                  <Link href={L("/admin/orders")} className="text-sm font-medium text-yellow-700 hover:text-yellow-900 transition-colors">
                    {locale === "ar" ? "مراجعة" : "Review"} →
                  </Link>
                </motion.div>
              )}
            </>
          )}

          {/* Sign out */}
          <div className="mt-8">
            <button onClick={() => signOut({ callbackUrl: L("/") })}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm">
              <LogOut size={18} />
              <span>{locale === "ar" ? "تسجيل الخروج" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // CUSTOMER PROFILE
  // ===========================
  const tabs: { key: Tab; label: string; labelFr: string; icon: typeof User }[] = [
    { key: "profile", label: "الملف الشخصي", labelFr: "Profil", icon: User },
    { key: "orders", label: "طلباتي", labelFr: "Commandes", icon: Package },
    { key: "favorites", label: "المفضلة", labelFr: "Favoris", icon: Heart },
    { key: "addresses", label: "عناويني", labelFr: "Adresses", icon: MapPin },
  ];

  const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    PENDING: { label: locale === "ar" ? "جديد" : "New", color: "bg-gray-100 text-gray-700", icon: Clock },
    CONFIRMED: { label: locale === "ar" ? "مؤكد" : "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
    PROCESSING: { label: locale === "ar" ? "قيد التنفيذ" : "Processing", color: "bg-yellow-100 text-yellow-700", icon: Settings },
    SHIPPED: { label: locale === "ar" ? "جاري الشحن" : "Shipped", color: "bg-purple-100 text-purple-700", icon: Truck },
    DELIVERED: { label: locale === "ar" ? "مكتمل" : "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    CANCELLED: { label: locale === "ar" ? "ملغي" : "Cancelled", color: "bg-red-100 text-red-700", icon: Clock },
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-light min-h-[70vh] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center">
              <span className="text-gold font-playfair text-2xl font-bold">{profile.name?.charAt(0) || "?"}</span>
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-secondary">
                {locale === "ar" ? `مرحباً ${profile.name?.split(" ")[0] || ""}` : `Welcome, ${profile.name?.split(" ")[0] || ""}`}
              </h1>
              <p className="text-gray-500 text-sm">{profile.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: ShoppingBag, label: locale === "ar" ? "إجمالي الطلبات" : "Total Orders", value: totalOrders.toString(), color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Package, label: locale === "ar" ? "المنتجات المفضلة" : "Favorites", value: "0", color: "text-pink-600", bg: "bg-pink-50" },
            { icon: MapPin, label: locale === "ar" ? "العناوين" : "Addresses", value: "0", color: "text-green-600", bg: "bg-green-50" },
            { icon: CheckCircle2, label: locale === "ar" ? "الإجمالي" : "Total Spent", value: `${totalSpent.toLocaleString()} د.م`, color: "text-gold", bg: "bg-gold/5" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <p className="font-bold text-secondary text-lg">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                      activeTab === tab.key ? "bg-gold/10 text-gold font-semibold" : "text-gray-600 hover:bg-gray-50"
                    }`}>
                    <tab.icon size={18} />
                    <span>{locale === "ar" ? tab.label : tab.labelFr}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 my-2" />
                <button onClick={() => signOut({ callbackUrl: L("/") })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm">
                  <LogOut size={18} />
                  <span>{locale === "ar" ? "تسجيل الخروج" : "Sign Out"}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                    <h2 className="font-semibold text-secondary text-lg mb-6 pb-4 border-b border-gray-100">
                      {locale === "ar" ? "الملف الشخصي" : "Profile Information"}
                    </h2>
                    <div className="space-y-5 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">{locale === "ar" ? "الاسم" : "Name"}</label>
                        <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-gray-50 focus:bg-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                        <input type="email" value={profile.email} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">{locale === "ar" ? "رقم الهاتف" : "Phone"}</label>
                        <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+212 6XX-XXXXXX" dir="ltr"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-gray-50 focus:bg-white" />
                      </div>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={saving}
                        onClick={async () => {
                          setSaving(true);
                          try {
                            const res = await fetch("/api/profile", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: profile.name, phone: profile.phone }),
                            });
                            if (!res.ok) {
                              const d = await res.json();
                              addToast(d.error || (locale === "ar" ? "خطأ في الحفظ" : "Save error"));
                              return;
                            }
                            addToast(locale === "ar" ? "تم حفظ التغييرات" : "Changes saved");
                          } catch {
                            addToast(locale === "ar" ? "خطأ في الاتصال" : "Connection error");
                          } finally { setSaving(false); }
                        }}
                        className="bg-gold text-secondary px-8 py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                        {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                    <h2 className="font-semibold text-secondary text-lg mb-6 pb-4 border-b border-gray-100">
                      {locale === "ar" ? "طلباتي" : "My Orders"}
                    </h2>
                    {loadingOrders ? (
                      <div className="flex justify-center py-12"><Loader2 size={24} className="text-gold animate-spin" /></div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package size={56} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">{locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}</p>
                        <button onClick={() => router.push(L("/products"))}
                          className="bg-gold text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20">
                          {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
                        </button>
                      </div>
                    ) : (
                      <StaggerContainer className="space-y-4" staggerDelay={0.08}>
                        {orders.map((order) => {
                          const st = statusLabels[order.status] || statusLabels.PENDING;
                          return (
                            <StaggerItem key={order.id}>
                              <motion.div whileHover={{ y: -2 }} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-all">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${st.color}`}><st.icon size={16} /></div>
                                    <div>
                                      <span className="font-semibold text-secondary">{order.orderNumber}</span>
                                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
                                    </div>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                                </div>
                                <div className="space-y-1 mb-3">
                                  {order.items.map((item, i) => (
                                    <p key={i} className="text-gray-600 text-sm">{item.product.name} <span className="text-gray-400">x{item.quantity}</span></p>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                  <p className="font-bold text-gold">{order.total.toLocaleString()} د.م</p>
                                  <button onClick={() => router.push(L("/track"))} className="text-xs text-gold hover:text-gold-dark font-medium transition-colors">
                                    {locale === "ar" ? "تتبع الطلب" : "Track Order"} →
                                  </button>
                                </div>
                              </motion.div>
                            </StaggerItem>
                          );
                        })}
                      </StaggerContainer>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "favorites" && (
                <motion.div key="favorites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50 text-center py-16">
                    <Heart size={56} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">{locale === "ar" ? "لم تقم بإضافة أي منتجات للمفضلة بعد" : "No favorites yet"}</p>
                    <button onClick={() => router.push(L("/products"))}
                      className="bg-gold text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20">
                      {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      <h2 className="font-semibold text-secondary text-lg">{locale === "ar" ? "عناويني" : "My Addresses"}</h2>
                      <button className="bg-gold text-secondary px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-dark transition-all shadow-sm">
                        {locale === "ar" ? "إضافة عنوان" : "Add Address"}
                      </button>
                    </div>
                    <div className="text-center py-12">
                      <MapPin size={56} className="text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500">{locale === "ar" ? "لا توجد عناوين محفوظة" : "No saved addresses"}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
