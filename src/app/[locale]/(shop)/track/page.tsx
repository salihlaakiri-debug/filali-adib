"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Search, Package, Truck, CheckCircle, Clock, Loader2, Settings, MapPin, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/motion";
import { DiamondIcon } from "@/components/icons";

const statusSteps = [
  { key: "PENDING", icon: Clock, color: "text-gray-500", bg: "bg-gray-100" },
  { key: "CONFIRMED", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-100" },
  { key: "PROCESSING", icon: Settings, color: "text-yellow-500", bg: "bg-yellow-100" },
  { key: "SHIPPED", icon: Truck, color: "text-purple-500", bg: "bg-purple-100" },
  { key: "DELIVERED", icon: CheckCircle, color: "text-green-500", bg: "bg-green-100" },
];

export default function TrackOrderPage() {
  const locale = useLocale();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const labels: Record<string, string> = {
    PENDING: locale === "ar" ? "تم استلام الطلب" : "Order Received",
    CONFIRMED: locale === "ar" ? "تم تأكيد الطلب" : "Order Confirmed",
    PROCESSING: locale === "ar" ? "قيد التجهيز" : "Preparing",
    SHIPPED: locale === "ar" ? "جاري الشحن" : "Shipped",
    DELIVERED: locale === "ar" ? "تم التوصيل" : "Delivered",
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?number=${encodeURIComponent(orderNumber.trim())}`);
      const data = await res.json();
      setOrder(data.order || null);
    } catch { setOrder(null); } finally { setLoading(false); }
  };

  const currentStepIndex = order ? statusSteps.findIndex((s) => s.key === order.status) : -1;

  return (
    <div className="bg-light min-h-[70vh] py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <FadeIn direction="up" delay={0.1}>
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Package size={32} className="text-gold" />
            </motion.div>
            <h1 className="font-playfair text-3xl font-bold text-secondary mb-2">
              {locale === "ar" ? "تتبع طلبك" : "Track Your Order"}
            </h1>
            <p className="text-gray-500">
              {locale === "ar" ? "أدخل رقم الطلب لمعرفة حالة الشحن" : "Enter your order number to check shipping status"}
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)}
                placeholder={locale === "ar" ? "رقم الطلب (مثال: FA-XXXX)" : "Order number (e.g. FA-XXXX)"}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white text-base shadow-sm" />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="bg-gold text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
              <Search size={18} />
              {locale === "ar" ? "تتبع" : "Track"}
            </motion.button>
          </form>
        </FadeIn>

        {loading && (
          <div className="text-center py-12">
            <Loader2 size={32} className="text-gold animate-spin mx-auto" />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && searched && !order && (
            <FadeIn key="not-found">
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-50">
                <Package size={56} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium mb-2">
                  {locale === "ar" ? "لم يتم العثور على الطلب" : "Order Not Found"}
                </p>
                <p className="text-gray-400 text-sm">
                  {locale === "ar" ? "تأكد من صحة رقم الطلب وحاول مرة أخرى" : "Please check your order number and try again"}
                </p>
              </div>
            </FadeIn>
          )}

          {!loading && order && (
            <FadeIn key="order-found">
              {/* Order info card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-50">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                      <Package size={20} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-secondary text-lg">#{order.orderNumber}</h2>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span className="bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-bold">
                    {order.total?.toLocaleString()} د.م
                  </span>
                </div>

                {/* Progress Timeline */}
                <div className="space-y-0">
                  {statusSteps.map((step, i) => {
                    const isActive = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const isLast = i === statusSteps.length - 1;
                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div
                            animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                            transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isActive
                                ? `${step.bg} ${step.color} shadow-sm`
                                : "bg-gray-100 text-gray-300"
                            }`}
                          >
                            <step.icon size={18} />
                          </motion.div>
                          {!isLast && (
                            <div className={`w-0.5 h-10 ${i < currentStepIndex ? "bg-gold" : "bg-gray-200"}`} />
                          )}
                        </div>
                        <div className={`pb-5 flex-1 ${!isLast ? "border-b border-gray-50" : ""}`}>
                          <p className={`font-medium text-sm ${isActive ? "text-secondary" : "text-gray-400"}`}>
                            {labels[step.key]}
                          </p>
                          {isCurrent && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs text-gold mt-0.5 font-medium"
                            >
                              {locale === "ar" ? "الحالة الحالية" : "Current Status"}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-50">
                  <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gold" />
                    {locale === "ar" ? "المنتجات" : "Items"}
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {item.product?.images?.[0]?.url ? (
                            <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <DiamondIcon size={20} className="text-gold/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-secondary">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">
                            {locale === "ar" ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
