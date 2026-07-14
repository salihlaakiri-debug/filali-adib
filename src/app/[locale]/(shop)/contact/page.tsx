"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, TextReveal } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

const WHATSAPP_NUMBER = "212644690861";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast("تم إرسال رسالتك بنجاح");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`مرحباً فيلالي عديب، أريد الاستفسار عن:\n\nالاسم: ${formData.name || "غير محدد"}\nالموضوع: ${formData.subject || "عام"}\nالرسالة: ${formData.message || "لم تُذكر"}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const contactItems = [
    { icon: MapPin, label: t("info.address"), value: "الطالعة الكبيرة 42، فاس المرينية\nفاس 30000، المغرب", action: "https://maps.google.com/?q=Fes+Medina+Talaa+Kebira" },
    { icon: Phone, label: t("info.phone"), value: "+212 6 44 69 08 61", action: "tel:+212644690861" },
    { icon: MessageCircle, label: "واتساب", value: "+212 6 44 69 08 61", action: `https://wa.me/${WHATSAPP_NUMBER}` },
    { icon: Mail, label: t("info.email"), value: "contact@filaliadib.com", action: "mailto:contact@filaliadib.com" },
    { icon: Clock, label: t("info.hours"), value: "الاثنين - السبت: 9:30 - 20:00\nالأحد: 10:00 - 14:00" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-secondary text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <TextReveal delay={0.2}>
            <h1 className="font-playfair text-4xl font-bold mb-4">{t("title")}</h1>
          </TextReveal>
          <FadeIn direction="up" delay={0.4}>
            <p className="text-gray-300 max-w-2xl mx-auto">نحن هنا لمساعدتك. لا تتردد في التواصل معنا عبر أي قناة تفضلها</p>
          </FadeIn>
        </div>
      </section>

      {/* Quick WhatsApp CTA */}
      <section className="bg-gold/5 py-6 border-b border-gold/10">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
          <MessageCircle className="text-green-600" size={20} />
          <span className="text-gray-700 font-medium">هل تريد استشارة سريعة؟</span>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً فيلالي عديب، أريد الاستفسار")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-all shadow-md">
            تواصل عبر واتساب
          </a>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <StaggerContainer className="space-y-5" staggerDelay={0.1}>
                {contactItems.map((item, i) => (
                  <StaggerItem key={i}>
                    <motion.div whileHover={{ x: 4 }} className="flex items-start gap-4">
                      <motion.div whileHover={{ rotate: 15, scale: 1.1 }}
                        className="w-11 h-11 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <item.icon className="text-gold" size={18} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary mb-1 text-sm">{item.label}</h3>
                        {item.action ? (
                          <a href={item.action} target="_blank" rel="noopener noreferrer"
                            className="text-gray-600 whitespace-pre-line hover:text-gold transition-colors text-sm">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-600 whitespace-pre-line text-sm">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}

                {/* Map */}
                <StaggerItem>
                  <div className="bg-gray-100 rounded-xl overflow-hidden h-56 mt-4">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.836!2d-4.9997!3d34.0614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDAzJzQxLjAiTiA0wrAwMCcwMC4wIlc!5e0!3m2!1sar!2sma!4v1700000000000!5m2!1sar!2sma"
                      width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade" title="موقع فيلالي عديب - فاس" />
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Contact Form */}
            <FadeIn direction="left" delay={0.3}>
              <div className="lg:col-span-3">
                <motion.form onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
                  <h2 className="font-playfair text-2xl font-bold text-secondary mb-2">أرسل لنا رسالة</h2>
                  <p className="text-gray-500 text-sm mb-6">أو تواصل معنا مباشرة عبر واتساب</p>

                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("name")}</label>
                      <input type="text" required value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")}</label>
                      <input type="email" required value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف</label>
                      <input type="tel" value={formData.phone} dir="ltr" placeholder="+212 6XX-XXXXXX"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-left" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("subject")}</label>
                      <select value={formData.subject} required
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white">
                        <option value="">اختر الموضوع</option>
                        <option value="purchase">استفسار عن منتج</option>
                        <option value="price">استفسار عن الأسعار</option>
                        <option value="custom">طلب تصميم خاص</option>
                        <option value="complaint">شكوى</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("message")}</label>
                    <textarea rows={4} required value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none transition-all"
                      placeholder="اكتب رسالتك هنا..." />
                  </div>

                  <div className="flex gap-3">
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gold text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/40">
                      {submitted ? <><CheckCircle size={18} /> تم الإرسال</> : <><Send size={18} /> {t("submit")}</>}
                    </motion.button>
                    <motion.button type="button" onClick={handleWhatsApp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-md">
                      <MessageCircle size={18} /> واتساب
                    </motion.button>
                  </div>
                </motion.form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
