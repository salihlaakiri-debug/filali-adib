"use client";

import { useLocale } from "next-intl";
import { TextReveal, FadeIn } from "@/components/motion";
import { Shield, Lock, Eye, Trash2, Mail, Database } from "lucide-react";

const sections = [
  { icon: Database, titleAr: "1. المعلومات التي نجمعها", titleFr: "1. Informations collectées", contentAr: ["الاسم الكامل والبريد الإلكتروني ورقم الهاتف", "عناوين الشحن والفواتير", "سجل الطلبات والمعاملات", "معلومات استخدام الموقع (عنوان IP، نوع المتصفح)", "بيانات الدفع (تشفيرها عبر Stripe - لا نخزّن بيانات البطاقات)"], contentFr: ["Nom complet, email et téléphone", "Adresses de livraison et de facturation", "Historique des commandes et transactions", "Données d'utilisation du site (adresse IP, type de navigateur)", "Données de paiement (chiffrées via Stripe - nous ne stockons pas les cartes)"] },
  { icon: Eye, titleAr: "2. كيف نستخدم معلوماتكم", titleFr: "2. Utilisation des informations", contentAr: ["معالجة الطلبات وشحن المنتجات", "التواصل معكم بخصوص طلباتكم", "تحسين تجربة التسوق", "إرسال العروض والتوصيات (بموافقتكم)", "الامتثال للقوانين المعمول بها"], contentFr: ["Traitement des commandes et expédition", "Communication concernant vos commandes", "Amélioration de l'expérience d'achat", "Envoi d'offres et recommandations (avec votre consentement)", "Conformité aux lois en vigueur"] },
  { icon: Lock, titleAr: "3. حماية البيانات", titleFr: "3. Protection des données", contentAr: ["نستخدم تقنيات تشفير SSL/TLS لحماية بياناتكم", "لا نخزّن بيانات البطاقات البنكية مباشرة", "جميع المعاملات المالية تتم عبر بوابة الدفع الآمنة Stripe"], contentFr: ["Nous utilisons le chiffrement SSL/TLS pour protéger vos données", "Nous ne stockons pas les données de cartes bancaires directement", "Toutes les transactions financières se font via Stripe"] },
  { icon: Shield, titleAr: "4. مشاركة البيانات", titleFr: "4. Partage des données", contentAr: ["لا نبيع بياناتكم لأي طرف ثالث", "شركات الشحن لتوصيل طلباتكم", "بوابة الدفع Stripe لمعالجة المعاملات", "جهات حكومية إذا طُلب ذلك قانونياً"], contentFr: ["Nous ne vendons jamais vos données à des tiers", "Sociétés de livraison pour expédier vos commandes", "Stripe pour le traitement des paiements", "Autorités gouvernementales si requis par la loi"] },
  { icon: Trash2, titleAr: "5. حقوقكم", titleFr: "5. Vos droits", contentAr: ["الحق في الوصول إلى بياناتكم الشخصية", "الحق في تصحيح البيانات غير الصحيحة", "الحق في حذف بياناتكم", "الحق في الاعتراض على معالجة بياناتكم", "الحق في نقل بياناتكم"], contentFr: ["Droit d'accès à vos données personnelles", "Droit de rectification des données incorrectes", "Droit à l'effacement de vos données", "Droit de s'opposer au traitement de vos données", "Droit à la portabilité de vos données"] },
];

export default function PrivacyPage() {
  const locale = useLocale();

  return (
    <div className="bg-light min-h-screen">
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <TextReveal delay={0.2}>
            <h1 className="font-playfair text-4xl font-bold mb-4">
              {locale === "ar" ? "سياسة الخصوصية" : "Politique de Confidentialité"}
            </h1>
          </TextReveal>
          <FadeIn direction="up" delay={0.4}>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Shield size={16} className="text-gold" />
              <p>{locale === "ar" ? "آخر تحديث: يناير 2026" : "Dernière mise à jour: Janvier 2026"}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn direction="up" delay={0.1}>
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-50">
              {/* Intro */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <p className="text-gray-600 leading-relaxed">
                  {locale === "ar"
                    ? "مرحباً بكم في فيلالي عديب. نحن ملتزمون بحماية خصوصيتك وبياناتكم الشخصية. تصفح موقعنا يعني موافقتك على سياسة الخصوصية هذه."
                    : "Bienvenue chez Filali Adib. Nous nous engageons à protéger votre vie privée et vos données personnelles. L'utilisation de notre site implique l'acceptation de cette politique de confidentialité."}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {sections.map((section, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                        <section.icon size={16} className="text-gold" />
                      </div>
                      <h2 className="font-playfair text-xl font-bold text-secondary">
                        {locale === "ar" ? section.titleAr : section.titleFr}
                      </h2>
                    </div>
                    <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside ps-11">
                      {(locale === "ar" ? section.contentAr : section.contentFr).map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Contact */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                      <Mail size={16} className="text-gold" />
                    </div>
                    <h2 className="font-playfair text-xl font-bold text-secondary">
                      {locale === "ar" ? "6. التواصل" : "6. Contact"}
                    </h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed ps-11">
                    {locale === "ar"
                      ? "لأي استفسار حول سياسة الخصوصية، يرجى التواصل معنا على:"
                      : "Pour toute question concernant cette politique, contactez-nous à:"}
                  </p>
                  <p className="text-gold font-medium mt-2 ps-11">contact@filali-adib.ma</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
