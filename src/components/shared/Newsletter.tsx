"use client";

import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { FadeIn } from "@/components/motion";
import { motion } from "framer-motion";
import { useState } from "react";

export function Newsletter() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 px-4 bg-secondary relative overflow-hidden noise-overlay">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold/3 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeIn direction="up">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-400 mb-10 text-lg">{t("description")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <motion.input
              whileFocus={{ borderColor: "rgba(212, 175, 55, 0.5)" }}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gold text-secondary px-8 py-3.5 rounded-full font-semibold hover:bg-gold-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/40"
            >
              <Send size={18} />
              {submitted ? "تم الإرسال" : t("subscribe")}
            </motion.button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
