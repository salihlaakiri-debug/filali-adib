"use client";

import { useTranslations } from "next-intl";
import { Award, Heart, Shield, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, TextReveal } from "@/components/motion";

const values = [
  { icon: Gem, title: "الجودة", description: "نستخدم أجود أنواع الذهب عيار 18 و21 و24 مع شهادات أصالة" },
  { icon: Award, title: "الحرفية", description: "تصاميم يدوية فريدة تجمع بين الأصالة والحداثة" },
  { icon: Shield, title: "الثقة", description: "شفافية كاملة في الأسعار والوزن مع ضمانات شاملة" },
  { icon: Heart, title: "الخدمة", description: "فريق متخصص لمساعدتك في اختيار ما يناسبك" },
];

const milestones = [
  { year: "2005", title: "بداية المشوار", description: "فتح أول ورشة في الدار البيضاء" },
  { year: "2010", title: "التوسع", description: "افتتاح متجر رئيسي في مراكش" },
  { year: "2015", title: "الانفتاح", description: "بدء التصدير للأسواق الأوروبية" },
  { year: "2020", title: "الرقمية", description: "إطلاق المتجر الإلكتروني" },
  { year: "2024", title: "النمو", description: "افتتاح فروع جديدة في الرباط وطنجة" },
];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[500px] bg-secondary text-white flex items-center overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-secondary/70" />
        <div className="relative container mx-auto px-4">
          <TextReveal delay={0.3}>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          </TextReveal>
          <FadeIn direction="up" delay={0.5}>
            <p className="text-xl text-gold-light max-w-2xl">{t("storyText")}</p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-secondary mb-6">{t("story")}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">يعود تاريخ فيليالي عديب إلى عام 2005 عندما قرر الحرفي الماهر عديب فيليالي تأسيس ورشته الأولى لإنتاج المجوهرات الذهبية في الدار البيضاء.</p>
                <p className="text-gray-600 leading-relaxed mb-4">بفضل الحرفية العالية والتصاميم الفريدة، سرعان ما اكتسب المتجر سمعة طيبة بين العملاء الباحثين عن الجودة والأصالة.</p>
                <p className="text-gray-600 leading-relaxed">اليوم، نفخر بخدمة آلاف العملاء في المغرب وحول العالم، مع الحفاظ على نفس معايير الجودة والحرفي التي بدأنا بها.</p>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
              <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gold/10">
                <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                  alt="Filali Adib Workshop" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <TextReveal delay={0.1}>
            <h2 className="font-playfair text-3xl font-bold text-secondary text-center mb-12">{t("values")}</h2>
          </TextReveal>
          <StaggerContainer className="grid md:grid-cols-4 gap-8" staggerDelay={0.1}>
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  className="bg-white p-6 rounded-xl text-center shadow-sm transition-all cursor-default h-full">
                  <motion.div whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="text-gold" size={28} />
                  </motion.div>
                  <h3 className="font-semibold text-secondary mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <TextReveal delay={0.1}>
            <h2 className="font-playfair text-3xl font-bold text-secondary text-center mb-12">مسيرتنا</h2>
          </TextReveal>
          <div className="max-w-3xl mx-auto">
            <StaggerContainer className="space-y-0" staggerDelay={0.15}>
              {milestones.map((milestone, index) => (
                <StaggerItem key={index}>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <motion.div whileHover={{ scale: 1.2 }}
                        className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-gold/20">
                        {milestone.year.slice(-2)}
                      </motion.div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-full bg-gold/30 mt-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className="text-gold font-bold">{milestone.year}</p>
                      <h3 className="font-semibold text-secondary">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
