"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, TextReveal } from "@/components/motion";

const statusSteps = [
  { key: "PENDING", label: "تم استلام الطلب", icon: Clock, color: "text-gray-500" },
  { key: "CONFIRMED", label: "تم تأكيد الطلب", icon: CheckCircle, color: "text-blue-500" },
  { key: "PROCESSING", label: "قيد التجهيز", icon: Package, color: "text-yellow-500" },
  { key: "SHIPPED", label: "جاري الشحن", icon: Truck, color: "text-blue-500" },
  { key: "DELIVERED", label: "تم التوصيل", icon: CheckCircle, color: "text-green-500" },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
        <TextReveal delay={0.1}>
          <h1 className="font-playfair text-3xl font-bold text-secondary text-center mb-2">تتبع طلبك</h1>
        </TextReveal>
        <FadeIn direction="up" delay={0.2}>
          <p className="text-center text-gray-500 mb-8">أدخل رقم الطلب لمعرفة حالة الشحن</p>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="رقم الطلب (مثال: FA-XXXX)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white" />
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="bg-gold text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
              <Search size={18} /> تتبع
            </motion.button>
          </form>
        </FadeIn>

        {loading && (
          <div className="text-center py-12">
            <Loader2 size={32} className="text-gold animate-spin mx-auto" />
          </div>
        )}

        {!loading && searched && !order && (
          <FadeIn>
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لم يتم العثور على الطلب</p>
              <p className="text-gray-400 text-sm mt-2">تأكد من صحة رقم الطلب وحاول مرة أخرى</p>
            </div>
          </FadeIn>
        )}

        {!loading && order && (
          <FadeIn>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-secondary text-lg">طلب #{order.orderNumber}</h2>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("ar-MA", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium">
                  {order.total?.toLocaleString()} د.م
                </span>
              </div>

              {/* Progress Steps */}
              <div className="space-y-0">
                {statusSteps.map((step, i) => {
                  const isActive = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <motion.div animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                          transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? "bg-gold text-white shadow-lg shadow-gold/20" : "bg-gray-100 text-gray-400"}`}>
                          <step.icon size={18} />
                        </motion.div>
                        {i < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-12 ${i < currentStepIndex ? "bg-gold" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`font-medium text-sm ${isActive ? "text-secondary" : "text-gray-400"}`}>{step.label}</p>
                        {isCurrent && <p className="text-xs text-gold mt-0.5">الحالة الحالية</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-secondary mb-4">المنتجات</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-sm text-secondary">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FadeIn>
        )}
      </div>
    </div>
  );
}
