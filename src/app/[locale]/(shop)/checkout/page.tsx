"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, CheckCircle2, Loader2, Shield, ArrowRight, ArrowLeft, MapPin, Package, Lock } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/motion/Toast";
import { DiamondIcon } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";

type CheckoutStep = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getSubtotal, getShipping, getTax, getTotal, getDiscount, getFinalTotal, coupon, clearCart } = useCartStore();
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
      addToast(locale === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
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
          couponCode: coupon?.code || null,
          couponId: coupon?.couponId || null,
          discount: coupon?.discount || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error || (locale === "ar" ? "حدث خطأ" : "Error occurred")); return; }
      clearCart();
      addToast(locale === "ar" ? `تم إنشاء الطلب بنجاح` : "Order placed successfully");
      router.push(`${L("/order-success")}?order=${data.order.orderNumber}`);
    } catch {
      addToast(locale === "ar" ? "حدث خطأ في الاتصال" : "Connection error");
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="bg-light min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}</p>
          <button onClick={() => router.push(L("/products"))} className="bg-gold text-secondary px-6 py-3 rounded-xl font-semibold">
            {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
          </button>
        </div>
      </div>
    );
  }

  const steps: { key: CheckoutStep; label: string; icon: typeof Truck }[] = [
    { key: "shipping", label: t("shipping"), icon: MapPin },
    { key: "payment", label: t("payment"), icon: CreditCard },
    { key: "review", label: t("review"), icon: CheckCircle2 },
  ];
  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="bg-light min-h-[70vh] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-playfair text-3xl font-bold text-secondary">{t("title")}</h1>
          <p className="text-gray-500 mt-1">
            {locale === "ar" ? "أكمل بياناتك لإتمام الطلب" : "Complete your details to place your order"}
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, index) => (
            <div key={s.key} className="flex items-center">
              <motion.button
                whileHover={index <= currentStepIndex ? { scale: 1.05 } : {}}
                onClick={() => { if (index <= currentStepIndex) setStep(s.key); }}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all ${
                  step === s.key
                    ? "bg-gold text-secondary font-semibold shadow-lg shadow-gold/20"
                    : index < currentStepIndex
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.key ? "bg-secondary text-gold" : index < currentStepIndex ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {index < currentStepIndex ? <CheckCircle2 size={14} /> : index + 1}
                </div>
                <span className="hidden sm:inline text-sm">{s.label}</span>
              </motion.button>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors ${
                  index < currentStepIndex ? "bg-green-400" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Steps content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "shipping" && (
                <motion.div key="shipping" initial={{ opacity: 0, x: locale === "ar" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-secondary text-lg">{t("shipping")}</h2>
                      <p className="text-xs text-gray-400">{locale === "ar" ? "أين تريد توصيل طلبك؟" : "Where should we deliver?"}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: t("firstName"), key: "firstName", type: "text", placeholder: locale === "ar" ? "محمد" : "Mohammed" },
                      { label: t("lastName"), key: "lastName", type: "text", placeholder: locale === "ar" ? "العلوي" : "Alaoui" },
                      { label: t("email"), key: "email", type: "email", placeholder: "email@example.com", dir: "ltr" },
                      { label: t("phone"), key: "phone", type: "tel", placeholder: "+212 6XX-XXXXXX", dir: "ltr" },
                      { label: t("address"), key: "address", type: "text", span: true, placeholder: locale === "ar" ? "العنوان التفصيلي" : "Full address" },
                      { label: t("city"), key: "city", type: "text", placeholder: locale === "ar" ? "فاس" : "Fès" },
                      { label: t("postalCode"), key: "postalCode", type: "text", placeholder: "30000", dir: "ltr" },
                    ].map((field) => (
                      <div key={field.key} className={field.span ? "md:col-span-2" : ""}>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">{field.label}</label>
                        <input type={field.type} value={(shippingData as any)[field.key]}
                          onChange={(e) => setShippingData({ ...shippingData, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          dir={(field as any).dir}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-gray-50 focus:bg-white" />
                      </div>
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={() => setStep("payment")}
                    className="mt-6 bg-gold text-secondary px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
                    {t("payment")} {locale === "ar" ? <ArrowLeft size={18} className="rotate-180" /> : <ArrowRight size={18} />}
                  </motion.button>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: locale === "ar" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                      <CreditCard size={20} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-secondary text-lg">{t("payment")}</h2>
                      <p className="text-xs text-gray-400">{locale === "ar" ? "اختر طريقة الدفع" : "Choose your payment method"}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { value: "CASH_ON_DELIVERY", label: locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery", desc: locale === "ar" ? "ادفع نقداً عند استلام الطلب" : "Pay cash upon delivery", icon: Truck },
                      { value: "BANK_TRANSFER", label: locale === "ar" ? "التحويل البنكي" : "Bank Transfer", desc: locale === "ar" ? "تحويل مباشر إلى حسابنا البنكي" : "Direct transfer to our bank account", icon: CreditCard },
                    ].map((m) => (
                      <label key={m.value}
                        className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === m.value ? "border-gold bg-gold/5 shadow-sm" : "border-gray-200 hover:border-gold/30"
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          paymentMethod === m.value ? "bg-gold/10" : "bg-gray-100"
                        }`}>
                          <m.icon size={20} className={paymentMethod === m.value ? "text-gold" : "text-gray-400"} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-secondary">{m.label}</p>
                          <p className="text-sm text-gray-500">{m.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === m.value ? "border-gold" : "border-gray-300"
                        }`}>
                          {paymentMethod === m.value && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                        </div>
                        <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                          onChange={() => setPaymentMethod(m.value)} className="sr-only" />
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep("shipping")}
                      className="px-6 py-3.5 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <ArrowLeft size={16} className={locale === "ar" ? "rotate-180" : ""} /> {locale === "ar" ? "رجوع" : "Back"}
                    </button>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setStep("review")}
                      className="bg-gold text-secondary px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
                      {t("review")} <ArrowRight size={18} className={locale === "ar" ? "rotate-180" : ""} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === "review" && (
                <motion.div key="review" initial={{ opacity: 0, x: locale === "ar" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-50">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-secondary text-lg">{t("review")}</h2>
                      <p className="text-xs text-gray-400">{locale === "ar" ? "راجع بياناتك قبل التأكيد" : "Review your details before confirming"}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={14} className="text-gold" />
                        <p className="text-sm font-medium text-gray-500">{locale === "ar" ? "عنوان الشحن" : "Shipping Address"}</p>
                      </div>
                      <p className="font-medium text-secondary">{shippingData.firstName} {shippingData.lastName}</p>
                      <p className="text-gray-600 text-sm">{shippingData.address}</p>
                      <p className="text-gray-600 text-sm">{shippingData.city}, {shippingData.postalCode}</p>
                      {shippingData.phone && <p className="text-gray-500 text-sm mt-1" dir="ltr">{shippingData.phone}</p>}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={14} className="text-gold" />
                        <p className="text-sm font-medium text-gray-500">{locale === "ar" ? "طريقة الدفع" : "Payment Method"}</p>
                      </div>
                      <p className="font-medium text-secondary">
                        {paymentMethod === "CASH_ON_DELIVERY"
                          ? (locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery")
                          : (locale === "ar" ? "التحويل البنكي" : "Bank Transfer")}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={14} className="text-gold" />
                        <p className="text-sm font-medium text-gray-500">{locale === "ar" ? "المنتجات" : "Items"}</p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <DiamondIcon size={16} className="text-gold/40" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-secondary truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">{locale === "ar" ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}</p>
                            </div>
                            <p className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()} د.م</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep("payment")}
                      className="px-6 py-3.5 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <ArrowLeft size={16} className={locale === "ar" ? "rotate-180" : ""} /> {locale === "ar" ? "رجوع" : "Back"}
                    </button>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={handlePlaceOrder} disabled={loading}
                      className="bg-gold text-secondary px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-gold/20">
                      {loading ? (
                        <><Loader2 size={18} className="animate-spin" /> {locale === "ar" ? "جاري المعالجة..." : "Processing..."}</>
                      ) : (
                        <><Lock size={18} /> {t("placeOrder")}</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 border border-gray-50">
              <h3 className="font-semibold text-secondary mb-4 pb-4 border-b border-gray-100">
                {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
              </h3>
              <div className="space-y-3 text-sm mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-500 truncate me-2 max-w-[60%]">{item.name} x{item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toLocaleString()} د.م</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === "ar" ? "الشحن" : "Shipping"}</span>
                  <span>{getShipping() === 0 ? <span className="text-green-600">{locale === "ar" ? "مجاني" : "Free"}</span> : `${getShipping()} د.م`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === "ar" ? "الضريبة" : "Tax"}</span>
                  <span>{getTax().toLocaleString()} د.م</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{locale === "ar" ? "خصم الكوبون" : "Coupon Discount"} ({coupon?.code})</span>
                    <span className="font-medium">-{getDiscount().toLocaleString()} د.م</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-secondary">{locale === "ar" ? "المجموع" : "Total"}</span>
                  <span className="font-bold text-gold text-xl">{getFinalTotal().toLocaleString()} د.م</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield size={14} className="text-gold flex-shrink-0" />
                  <span>{locale === "ar" ? "معلوماتك مشفرة وآمنة" : "Your data is encrypted and secure"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
