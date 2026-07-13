"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, CheckCircle2, Loader2, Shield } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

type CheckoutStep = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getSubtotal, getShipping, getTax, getTotal, clearCart } = useCartStore();
  const { addToast } = useToast();
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [shippingData, setShippingData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", country: "Morocco", postalCode: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push(L("/login"));
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="text-gold animate-spin" />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!shippingData.firstName || !shippingData.lastName || !shippingData.address || !shippingData.city) {
      addToast("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          shippingAddress: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            address: shippingData.address,
            city: shippingData.city,
            country: shippingData.country,
            postalCode: shippingData.postalCode,
            phone: shippingData.phone,
          },
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || "حدث خطأ في إنشاء الطلب");
        return;
      }
      clearCart();
      addToast(`تم إنشاء الطلب بنجاح - ${data.order.orderNumber}`);
      router.push(L("/order-success"));
    } catch {
      addToast("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-light min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">سلتك فارغة</p>
          <button onClick={() => router.push(L("/products"))} className="bg-gold text-secondary px-6 py-3 rounded-xl font-semibold">
            تصفح المنتجات
          </button>
        </div>
      </div>
    );
  }

  const steps: { key: CheckoutStep; label: string; icon: typeof Truck }[] = [
    { key: "shipping", label: t("shipping"), icon: Truck },
    { key: "payment", label: t("payment"), icon: CreditCard },
    { key: "review", label: t("review"), icon: CheckCircle2 },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="bg-light min-h-[60vh] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="font-playfair text-3xl font-bold text-secondary mb-8 text-center">
          {t("title")}
        </motion.h1>

        <div className="flex items-center justify-center mb-12">
          {steps.map((s, index) => (
            <div key={s.key} className="flex items-center">
              <button onClick={() => { if (index <= currentStepIndex) setStep(s.key); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  step === s.key ? "bg-gold text-secondary font-semibold" : index < currentStepIndex ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                }`}>
                {index < currentStepIndex ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                <span className="hidden md:inline">{s.label}</span>
              </button>
              {index < steps.length - 1 && <div className={`w-12 h-0.5 mx-2 ${index < currentStepIndex ? "bg-gold" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-secondary text-lg mb-6">{t("shipping")}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[{ label: t("firstName"), key: "firstName", type: "text" }, { label: t("lastName"), key: "lastName", type: "text" },
                    { label: t("email"), key: "email", type: "email" }, { label: t("phone"), key: "phone", type: "tel" },
                    { label: t("address"), key: "address", type: "text", span: true },
                    { label: t("city"), key: "city", type: "text" }, { label: t("postalCode"), key: "postalCode", type: "text" },
                  ].map((field) => (
                    <div key={field.key} className={field.span ? "md:col-span-2" : ""}>
                      <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                      <input type={field.type} value={(shippingData as any)[field.key]}
                        onChange={(e) => setShippingData({ ...shippingData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("payment")}
                  className="mt-6 bg-gold text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all">
                  {t("payment")}
                </motion.button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-secondary text-lg mb-6">{t("payment")}</h2>
                <div className="space-y-4 mb-6">
                  {[{ value: "CASH_ON_DELIVERY", label: "الدفع عند الاستلام", desc: "ادفع نقداً عند التوصيل", icon: Truck },
                    { value: "BANK_TRANSFER", label: "التحويل البنكي", desc: "تحويل مباشر إلى الحساب البنكي", icon: CreditCard },
                  ].map((m) => (
                    <label key={m.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === m.value ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gold/50"}`}>
                      <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                        onChange={() => setPaymentMethod(m.value)} className="accent-gold" />
                      <m.icon size={20} className={paymentMethod === m.value ? "text-gold" : "text-gray-400"} />
                      <div>
                        <p className="font-medium">{m.label}</p>
                        <p className="text-sm text-gray-500">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep("shipping")} className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    رجوع
                  </button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("review")}
                    className="bg-gold text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all">
                    {t("review")}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "review" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-secondary text-lg mb-6">{t("review")}</h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">عنوان الشحن</p>
                    <p className="font-medium">{shippingData.firstName} {shippingData.lastName}</p>
                    <p className="text-gray-600">{shippingData.address}</p>
                    <p className="text-gray-600">{shippingData.city}, {shippingData.postalCode}</p>
                    <p className="text-gray-600">{shippingData.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">طريقة الدفع</p>
                    <p className="font-medium">{paymentMethod === "CASH_ON_DELIVERY" ? "الدفع عند الاستلام" : "التحويل البنكي"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">المنتجات</p>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between py-1">
                        <span className="text-gray-600">{item.name} x {item.quantity}</span>
                        <span className="font-medium">{(item.price * item.quantity).toLocaleString()} د.م</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep("payment")} className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    رجوع
                  </button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder} disabled={loading}
                    className="bg-gold text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 disabled:opacity-50">
                    {loading ? <><Loader2 size={18} className="animate-spin" /> جاري المعالجة...</> : <><Shield size={18} /> {t("placeOrder")}</>}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-secondary mb-4">ملخص الطلب</h3>
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} د.م</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-gray-600">الشحن</span>
                  <span>{getShipping() === 0 ? "مجاني" : `${getShipping()} د.م`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة</span>
                  <span>{getTax().toLocaleString()} د.م</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold">المجموع</span>
                  <span className="font-bold text-gold text-lg">{getTotal().toLocaleString()} د.م</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
