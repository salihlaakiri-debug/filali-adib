"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, TextReveal } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

export default function ContactPage() {
  const t = useTranslations("contact");
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast("تم إرسال رسالتك بنجاح");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactItems = [
    { icon: MapPin, label: t("info.address"), value: "شارع محمد الخامس، الدار البيضاء، المغرب" },
    { icon: Phone, label: t("info.phone"), value: "+212 5XX-XXXXXX" },
    { icon: Mail, label: t("info.email"), value: "contact@filaliadib.com" },
    { icon: Clock, label: t("info.hours"), value: "الاثنين - السبت: 9:00 - 20:00\nالأحد: مغلق" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary text-white py-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <TextReveal delay={0.2}>
            <h1 className="font-playfair text-4xl font-bold mb-4">{t("title")}</h1>
          </TextReveal>
          <FadeIn direction="up" delay={0.4}>
            <p className="text-gray-300 max-w-2xl mx-auto">نحن هنا لمساعدتك. لا تتردد في التواصل معنا</p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <StaggerContainer className="space-y-6" staggerDelay={0.12}>
              {contactItems.map((item, i) => (
                <StaggerItem key={i}>
                  <motion.div whileHover={{ x: 4 }} className="flex items-start gap-4">
                    <motion.div whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-gold" size={20} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-secondary mb-1">{item.label}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}

              <StaggerItem>
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center overflow-hidden">
                  <motion.div animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
                    <p className="text-gray-400">خريطة الموقع</p>
                  </motion.div>
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* Contact Form */}
            <FadeIn direction="left" delay={0.3}>
              <div className="lg:col-span-2">
                <motion.form onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
                  <h2 className="font-playfair text-2xl font-bold text-secondary mb-6">أرسل لنا رسالة</h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {[{ label: t("name"), key: "name", type: "text" }, { label: t("email"), key: "email", type: "email" }].map((field) => (
                      <motion.div key={field.key} whileFocus={{ borderColor: "#D4AF37" }}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                        <input type={field.type} required value={(formData as any)[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("subject")}</label>
                    <input type="text" required value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("message")}</label>
                    <textarea rows={5} required value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 resize-none transition-all" />
                  </div>

                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="bg-gold text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/40">
                    {submitted ? <><CheckCircle size={18} /> تم الإرسال</> : <><Send size={18} /> {t("submit")}</>}
                  </motion.button>
                </motion.form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
