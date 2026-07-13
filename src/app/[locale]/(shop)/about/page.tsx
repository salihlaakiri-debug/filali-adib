"use client";

import { useTranslations } from "next-intl";
import { Award, Heart, Shield, Gem, MapPin, Star, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, TextReveal } from "@/components/motion";

const values = [
  { icon: Gem, titleAr: "جودة لا تضاهى", titleFr: "Qualité Inégalée", descAr: "نختار أجود أنواع الذهب عيار 18 و21 و24 بمعايير دولية صارمة، مع شهادات أصالة مرفقة بكل قطعة", descFr: "Nous sélectionnons les meilleurs ors 18, 21 et 24 carats selon des normes internationales strictes, avec certificats d'authenticité pour chaque pièce" },
  { icon: Award, titleAr: "حرفية فاسية أصيلة", titleFr: "Artisanat Fassi Authentique", descAr: "تراث فاس في صناعة المجوهرات يمتد لقرون. حرفيونا يجمعون بين تقنيات الأجداد وروح العصر", descFr: "L'héritage fassi dans la joaillerie remonte à des siècles. Nos artisans allient techniques ancestrales et esprit moderne" },
  { icon: Shield, titleAr: "ثقة وشفافية", titleFr: "Confiance et Transparence", descAr: "أسعار واضحة ووزن مضمون. كل معاملة موثقة بكل شفافية، لأن ثقتكم أغلى ما نملك", descFr: "Prix clairs et poids garanti. Chaque transaction documentée avec transparence, car votre confiance est notre plus grande richesse" },
  { icon: Heart, titleAr: "خدمة ما بعد البيع", titleFr: "Service Après-Vente", descAr: "صياغة مجانية، صيانة دورية، واستشارة مجانية مع خبرائنا لاختيار القطعة المثالية", descFr: "Gravure gratuite, entretien périodique, et consultation gratuite avec nos experts pour choisir la pièce parfaite" },
];

const milestones = [
  { year: "1985", titleAr: "بداية الحرفية", titleFr: "L'Origine de l'Artisanat", descAr: "أسس العلامة الراحل عبد الرحيم فيليالي ورشته الأولى في قلب فاس المرينية، حيث تعلم أسرار صناعة الذهب من حرفي المدينة العتيقة", descFr: "Le défunt Abderrahim Filali fonde son premier atelier au cœur de Fès el-Bali, où il apprend les secrets de l'or chez les artisans de la médina" },
  { year: "1995", titleAr: "توريث الحرف", titleFr: "Transmission du Savoir", descAr: "انضمام عديب فيليالي إلى الورشة وتعلم فنون الصياغة والتصميم من والده، ليصبح واحداً من أبرز حرفي فاس", descFr: "Adib Filali rejoint l'atelier et maîtrise les arts de la fabrication et du design sous la direction de son père, devenant l'un des artisans les plus renommés de Fès" },
  { year: "2005", titleAr: "افتتاح المتجر", titleFr: "Ouverture de la Boutique", descAr: "إطلاق متجر فيلالي عديب في شارع الطالعة الكبيرة بفاس، ليقدم تشكيلة فريدة من المجوهرات الذهبية المغربية", descFr: "Ouverture de la boutique Filali Adib sur la Talaa Kebira à Fès, offrant une collection unique de bijoux en or marocains" },
  { year: "2012", titleAr: "التوسع الإقليمي", titleFr: "Expansion Régionale", descAr: "افتتاح فرع في الدار البيضاء ومراكش، وبداية التعاون مع مصممين دوليين للجمع بين الأصالة المغربية والعصرية", descFr: "Ouverture de succursales à Casablanca et Marrakech, et début de collaborations avec des designers internationaux" },
  { year: "2018", titleAr: "الעידن الرقمي", titleFr: "Ère Numérique", descAr: "إطلاق المتجر الإلكتروني لخدمة عملاءنا في مختلف أنحاء المغرب والعالم", descFr: "Lancement de la boutique en ligne pour servir nos clients à travers le Maroc et le monde entier" },
  { year: "2024", titleAr: "ريادة السوق", titleFr: "Leader du Marché", descAr: "تحقيق مكانة رائدة في سوق المجوهرات الذهبية في المغرب بفضل ثقة آلاف العملاء", descFr: "Consolidation de notre position de leader sur le marché de la joaillerie au Maroc grâce à la confiance de milliers de clients" },
];

const stats = [
  { icon: Clock, value: "40+", labelAr: "سنة من الخبرة", labelFr: "Années d'Expérience" },
  { icon: Users, value: "50,000+", labelAr: "عميل سعيد", labelFr: "Clients Satisfaits" },
  { icon: Star, value: "25,000+", labelAr: "قطعة ذهبية", labelFr: "Pièces en Or" },
  { icon: Award, value: "100%", labelAr: "ضمان الأصالة", labelFr: "Garantie d'Authenticité" },
];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[500px] bg-secondary text-white flex items-center overflow-hidden">
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
            <p className="text-xl text-gold-light max-w-2xl">{t("storyText")}</p>
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
                  <stat.icon className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-3xl font-bold text-gold">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.labelAr}</p>
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
                  يعود تاريخ فيليالي عديب إلى عام 1985 في قلب فاس المرينية، حيث أسس المرحوم عبد الرحيم فيليالي ورشته الأولى لإنتاج المجوهرات الذهبية في أحد أزقة المدينة القديمة.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  نشأ عديب فيليالي في هذه الورشة، تعلم فنون الصياغة والتصميم من والده وأساتذة فاس الحرفية. 오늘، يحمل هذا التراث ويطوره بتصاميم تجمع بين أصالة فاس وروح العصر.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  نفتخر بخدمة أكثر من 50,000 عميل في المغرب وحول العالم. كل قطعة نصنعها تحمل روح فاس وحرفيتها الشهيرة، مع ضمان الجودة والشفافية في كل معاملة.
                </p>
                <div className="flex items-center gap-2 mt-6 text-gold">
                  <MapPin size={18} />
                  <span className="font-medium">شارع الطالعة الكبيرة، فاس المرينية، المغرب</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/10 to-transparent rounded-3xl" />
                <div className="relative h-[450px] rounded-2xl overflow-hidden bg-gold/10">
                  <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
                    alt="ورشة فيلالي عديب في فاس" className="w-full h-full object-cover" />
                </div>
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
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <motion.div whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  className="bg-white p-6 rounded-xl shadow-sm transition-all cursor-default h-full">
                  <motion.div whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="text-gold" size={24} />
                  </motion.div>
                  <h3 className="font-semibold text-secondary mb-2">{value.titleAr}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.descAr}</p>
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
            <h2 className="font-playfair text-3xl font-bold text-secondary text-center mb-4">مسيرتنا</h2>
          </TextReveal>
          <FadeIn direction="up" delay={0.2}>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">أكثر من 40 عاماً من الحرفية والجودة في خدمة المجوهرات الذهبية المغربية</p>
          </FadeIn>
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
                    <div className="pb-8">
                      <h3 className="font-semibold text-secondary text-lg">{milestone.titleAr}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.descAr}</p>
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
            <h2 className="font-playfair text-3xl font-bold mb-4">زورونا في فاس</h2>
          </TextReveal>
          <FadeIn direction="up" delay={0.3}>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              نستقبلكم في متجرنا位于 قلب فاس المرينية للاطلاع على تشكيلتنا الحصرية والاستشارة مع خبرائنا
            </p>
            <a href="https://wa.me/212600000000?text=مرحباً، أريد زيارة المتجر" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-secondary px-8 py-3 rounded-full font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20">
              احجز زيارتك
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
