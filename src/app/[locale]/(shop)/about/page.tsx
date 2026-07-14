"use client";

import { useTranslations, useLocale } from "next-intl";
import { Award, Heart, Shield, Gem, MapPin, Star, Users, Clock, ArrowLeft, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, TextReveal } from "@/components/motion";
import { STORE, WHATSAPP_URL } from "@/lib/constants";

const values = [
  { icon: Gem, titleAr: "جودة لا تضاهى", titleFr: "Qualité Inégalée", descAr: "نختار أجود أنواع الذهب عيار 18 بمعايير دولية صارمة، مع شهادات أصالة مرفقة بكل قطعة", descFr: "Nous sélectionnons le meilleur or 18 carats selon des normes internationales strictes, avec certificats d'authenticité pour chaque pièce" },
  { icon: Award, titleAr: "حرفية فاسية أصيلة", titleFr: "Artisanat Fassi Authentique", descAr: "تراث فاس في صناعة المجوهرات يمتد لقرون. حرفيونا يجمعون بين تقنيات الأجداد وروح العصر", descFr: "L'héritage fassi dans la joaillerie remonte à des siècles. Nos artisans allient techniques ancestrales et esprit moderne" },
  { icon: Shield, titleAr: "ثقة وشفافية", titleFr: "Confiance et Transparence", descAr: "أسعار واضحة ووزن مضمون. كل معاملة موثقة بكل شفافية، لأن ثقتكم أغلى ما نملك", descFr: "Prix clairs et poids garanti. Chaque transaction documentée avec transparence, car votre confiance est notre plus grande richesse" },
  { icon: Heart, titleAr: "خدمة ما بعد البيع", titleFr: "Service Après-Vente", descAr: "صياغة مجانية، صيانة دورية، واستشارة مجانية مع خبرائنا لاختيار القطعة المثالية", descFr: "Gravure gratuite, entretien périodique, et consultation gratuite avec nos experts pour choisir la pièce parfaite" },
];

const milestones = [
  { year: "1985", titleAr: "بداية الحرفية", titleFr: "L'Origine", descAr: "أسس العلامة الراحل عبد الرحيم فيليالي ورشته الأولى في قلب فاس المرينية", descFr: "Le défunt Abderrahim Filali fonde son premier atelier au cœur de Fès el-Bali" },
  { year: "1995", titleAr: "توريث الحرف", titleFr: "Transmission", descAr: "انضمام عديب فيليالي إلى الورشة وتعلم فنون الصياغة من والده", descFr: "Adib Filali rejoint l'atelier et maîtrise les arts de la fabrication" },
  { year: "2005", titleAr: "افتتاح المتجر", titleFr: "Ouverture", descAr: "إطلاق متجر فيلالي عديب في شارع الطالعة الكبيرة بفاس", descFr: "Ouverture de la boutique sur la Talaa Kebira à Fès" },
  { year: "2012", titleAr: "التوسع الإقليمي", titleFr: "Expansion", descAr: "افتتاح فرع في الدار البيضاء ومراكش", descFr: "Ouverture de succursales à Casablanca et Marrakech" },
  { year: "2018", titleAr: "الעידن الرقمي", titleFr: "Ère Numérique", descAr: "إطلاق المتجر الإلكتروني لخدمة عملاءنا في مختلف أنحاء المغرب", descFr: "Lancement de la boutique en ligne pour servir nos clients au Maroc" },
  { year: "2024", titleAr: "ريادة السوق", titleFr: "Leader", descAr: "تحقيق مكانة رائدة في سوق المجوهرات الذهبية في المغرب", descFr: "Consolidation de notre position de leader au Maroc" },
];

const stats = [
  { icon: Clock, value: "40+", labelAr: "سنة من الخبرة", labelFr: "Années d'Expérience" },
  { icon: Users, value: "50K+", labelAr: "عميل سعيد", labelFr: "Clients Satisfaits" },
  { icon: Star, value: "25K+", labelAr: "قطعة ذهبية", labelFr: "Pièces en Or" },
  { icon: Award, value: "100%", labelAr: "ضمان الأصالة", labelFr: "Garantie" },
];

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[480px] bg-secondary text-white flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&q=80" alt="Filali Adib" className="w-full h-full object-cover opacity-30" />
        </div>
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-secondary/95 to-secondary/70" />
        <div className="relative container mx-auto px-4">
          <TextReveal delay={0.3}>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          </TextReveal>
          <FadeIn direction="up" delay={0.5}>
            <p className="text-xl text-gold-light max-w-2xl leading-relaxed">{t("storyText")}</p>
          </FadeIn>
          <FadeIn direction="up" delay={0.7}>
            <div className="flex items-center gap-3 mt-6">
              <MapPin size={18} className="text-gold" />
                <span className="text-gray-300">{locale === "ar" ? STORE.address.ar.split("،")[0] : STORE.address.fr.split(", F")[0]}</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gold/5 border-b border-gold/10">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" staggerDelay={0.1}>
            {stats.map((stat, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -4 }} className="text-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="text-gold" size={22} />
                  </div>
                  <p className="text-3xl font-bold text-gold">{stat.value}</p>
                  <p className="text-gray-600 text-sm mt-1">{locale === "ar" ? stat.labelAr : stat.labelFr}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-secondary mb-6">{t("story")}</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {locale === "ar"
                    ? "يعود تاريخ فيلالي عديب إلى عام 1985 في قلب فاس المرينية، حيث أسس المرحوم عبد الرحيم فيليالي ورشته الأولى لإنتاج المجوهرات الذهبية في أحد أزقة المدينة القديمة."
                    : "L'histoire de Filali Adib remonte à 1985 au cœur de Fès el-Bali, où le défunt Abderrahim Filali a fondé son premier atelier de joaillerie dans les ruelles de la médina."}
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {locale === "ar"
                    ? "نشأ عديب فيليالي في هذه الورشة، تعلم فنون الصياغة والتصميم من والده وأساتذة فاس الحرفية. اليوم، يحمل هذا التراث ويطوره بتصاميم تجمع بين أصالة فاس وروح العصر."
                    : "Adib Filali a grandi dans cet atelier, apprenant les arts de la fabrication et du design sous la direction de son père. Aujourd'hui, il porte cet héritage avec des designs alliant authenticité fassie et modernité."}
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {locale === "ar"
                    ? "نفتخر بخدمة أكثر من 50,000 عميل في المغرب وحول العالم. كل قطعة نصنعها تحمل روح فاس وحرفيتها الشهيرة، مع ضمان الجودة والشفافية في كل معاملة."
                    : "Nous sommes fiers de servir plus de 50 000 clients au Maroc et dans le monde. Chaque pièce que nous créons porte l'esprit de Fès, avec garantie de qualité et transparence."}
                </p>
                <div className="flex items-center gap-2 mt-6 text-gold">
                  <MapPin size={18} />
                  <span className="font-medium">{locale === "ar" ? STORE.address.ar : STORE.address.fr}</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/10 to-transparent rounded-3xl" />
                <div className="relative h-[450px] rounded-2xl overflow-hidden bg-gold/10">
                  <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                    alt="ورشة فيلالي عديب" className="w-full h-full object-cover" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <TextReveal delay={0.1}>
              <h2 className="font-playfair text-3xl font-bold text-secondary mb-3">{t("values")}</h2>
            </TextReveal>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-gray-500 max-w-xl mx-auto">
                {locale === "ar" ? "القيم التي نؤمن بها ونعمل بها كل يوم" : "Les valeurs auxquelles nous croyons et que nous pratiquons chaque jour"}
              </p>
            </FadeIn>
          </div>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  className="bg-white p-6 rounded-2xl shadow-sm transition-all cursor-default h-full border border-gray-50">
                  <motion.div whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-4">
                    <value.icon className="text-gold" size={24} />
                  </motion.div>
                  <h3 className="font-semibold text-secondary mb-2">{locale === "ar" ? value.titleAr : value.titleFr}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{locale === "ar" ? value.descAr : value.descFr}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <TextReveal delay={0.1}>
              <h2 className="font-playfair text-3xl font-bold text-secondary mb-3">
                {locale === "ar" ? "مسيرتنا" : "Notre Parcours"}
              </h2>
            </TextReveal>
            <FadeIn direction="up" delay={0.2}>
              <p className="text-gray-500 max-w-xl mx-auto">
                {locale === "ar" ? "أكثر من 40 عاماً من الحرفية والجودة" : "Plus de 40 ans de savoir-faire et de qualité"}
              </p>
            </FadeIn>
          </div>
          <div className="max-w-3xl mx-auto">
            <StaggerContainer className="space-y-0" staggerDelay={0.15}>
              {milestones.map((milestone, index) => (
                <StaggerItem key={index}>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <motion.div whileHover={{ scale: 1.2 }}
                        className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-gold/20 text-sm">
                        {milestone.year}
                      </motion.div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gold/30 mt-2" />
                      )}
                    </div>
                    <div className="pb-8 flex-1">
                      <h3 className="font-semibold text-secondary text-lg">{locale === "ar" ? milestone.titleAr : milestone.titleFr}</h3>
                      <p className="text-gray-500 leading-relaxed mt-1">{locale === "ar" ? milestone.descAr : milestone.descFr}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <TextReveal delay={0.1}>
            <h2 className="font-playfair text-3xl font-bold mb-4">
              {locale === "ar" ? "زورونا في فاس" : "Rendez-vous à Fès"}
            </h2>
          </TextReveal>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              {locale === "ar"
                ? "نستقبلكم في متجرنا في قلب فاس المرينية للاطلاع على تشكيلتنا الحصرية والاستشارة مع خبرائنا"
                : "Nous vous accueillons dans notre boutique au cœur de Fès pour découvrir notre collection exclusive et consulter nos experts"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`${WHATSAPP_URL}?text=مرحباً، أريد زيارة المتجر`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gold text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20">
                <Phone size={18} />
                {locale === "ar" ? "احجز زيارتك" : "Réserver une visite"}
              </a>
              <a href="https://maps.google.com/?q=Fes+Medina+Talaa+Kebira" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
                <MapPin size={18} />
                {locale === "ar" ? "الاتجاهات على الخريطة" : "Itinéraire"}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
