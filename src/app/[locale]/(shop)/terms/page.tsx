"use client";

import { useLocale } from "next-intl";
import { TextReveal, FadeIn } from "@/components/motion";
import { FileText, Package, CreditCard, Shield, Clock, Mail, Scale } from "lucide-react";

const sections = [
  { icon: FileText, titleAr: "1. قبول الشروط", titleFr: "1. Acceptation des conditions", contentAr: ["باستخدام موقع فيلالي عديب والشراء منه، أنت توافق على هذه الشروط والأحكام", "يُرجى قراءتها بعناية قبل إتمام أي عملية شراء"], contentFr: ["L'utilisation du site Filali Adib et tout achat implique l'acceptation de ces conditions", "Veuillez les lire attentivement avant toute commande"] },
  { icon: Package, titleAr: "2. المنتجات والأسعار", titleFr: "2. Produits et prix", contentAr: ["جميع الأسعار بالدرهم المغربي (د.م) وتشمل الضريبة", "أسعار الذهب قابلة للتغيير حسب السوق العالمية", "نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق", "الصور توضيحية وقد تختلف قليلاً عن المنتج الفعلي", "كل منتج يرافقه شهادة أصالة رسمية"], contentFr: ["Tous les prix sont en Dirhams Marocains (MAD) et incluent la taxe", "Les prix de l'or peuvent varier selon le marché mondial", "Nous nous réservons le droit de modifier les prix sans préavis", "Les images sont à titre indicatif", "Chaque produit est accompagné d'un certificat d'authenticité"] },
  { icon: Clock, titleAr: "3. الطلبات والتوصيل", titleFr: "3. Commandes et livraison", contentAr: ["الشحن مجاني داخل المغرب للطلبات فوق 5000 د.م", "مدة التوصيل: 2-5 أيام عمل داخل المغرب", "الشحن الدولي متاح - يرجى التواصل للاستفسار", "التوصيل عبر شركات شحن موثوقة مع تأمين شامل", "يجب التوقيع على الطلب عند الاستلام"], contentFr: ["Livraison gratuite au Maroc pour les commandes de plus de 5000 MAD", "Délai de livraison: 2-5 jours ouvrables au Maroc", "Livraison internationale disponible - contactez-nous", "Livraison via transporteurs fiables avec assurance complète", "Signature requise à la réception"] },
  { icon: Shield, titleAr: "4. سياسة الإرجاع والاستبدال", titleFr: "4. Politique de retour", contentAr: ["يمكنكم الإرجاع خلال 14 يوماً من تاريخ الاستلام", "يجب أن تكون القطعة في حالتها الأصلية مع جميع الملحقات", "القطع المخصصة (نقش خاص) لا يمكن إرجاعها", "يتحمل العميل تكلفة الشحن في حالة الإرجاع"], contentFr: ["Retour possible dans les 14 jours suivant la réception", "L'article doit être dans son état d'origine avec tous les accessoires", "Les pièces personnalisées (gravure) ne peuvent être retournées", "Les frais de retour sont à la charge du client"] },
  { icon: CreditCard, titleAr: "5. الدفع", titleFr: "5. Paiement", contentAr: ["الدفع عند الاستلام (المغرب فقط)", "تحويل بنكي", "جميع المعاملات مشفرة وآمنة 100%"], contentFr: ["Paiement à la livraison (Maroc uniquement)", "Virement bancaire", "Toutes les transactions sont 100% sécurisées"] },
  { icon: Scale, titleAr: "6. الضمان والقانون الحاكم", titleFr: "6. Garantie et juridiction", contentAr: ["ضمان شامل لمدة سنة واحدة على جميع المنتجات", "الصيانة الدورية مجانية مدى الحياة", "هذه الشروط محكومة بقوانين المملكة المغربية"], contentFr: ["Garantie d'un an sur tous les produits", "Entretien périodique gratuit à vie", "Ces conditions sont régies par les lois du Royaume du Maroc"] },
];

export default function TermsPage() {
  const locale = useLocale();

  return (
    <div className="bg-light min-h-screen">
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <TextReveal delay={0.2}>
            <h1 className="font-playfair text-4xl font-bold mb-4">
              {locale === "ar" ? "الشروط والأحكام" : "Conditions Générales de Vente"}
            </h1>
          </TextReveal>
          <FadeIn direction="up" delay={0.4}>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <FileText size={16} className="text-gold" />
              <p>{locale === "ar" ? "آخر تحديث: يناير 2026" : "Dernière mise à jour: Janvier 2026"}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn direction="up" delay={0.1}>
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-50">
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
                      {locale === "ar" ? "7. التواصل" : "7. Contact"}
                    </h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed ps-11">
                    {locale === "ar"
                      ? "لأي استفسار حول الشروط والأحكام:"
                      : "Pour toute question concernant les conditions:"}
                  </p>
                  <p className="text-gold font-medium mt-2 ps-11">contact@filali-adib.ma | +212 6 44 69 08 61</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
