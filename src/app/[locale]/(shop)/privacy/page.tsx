"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { Shield } from "lucide-react";
import { FaLogo } from "@/components/icons";

export default function PrivacyPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => (locale === "ar" ? ar : fr);
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  return (
    <div className="bg-light min-h-[70vh] flex items-center justify-center py-20">
      <div className="text-center max-w-md mx-auto px-4">
        <FaLogo size={48} className="text-gold mx-auto mb-6" />
        <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="text-gold" size={36} />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-secondary mb-4">
          {t("سياسة الخصوصية", "Politique de Confidentialité")}
        </h1>
        <p className="text-gray-500 mb-8">
          {t("هذه الصفحة قريباً. شكراً لصبركم.", "Cette page est bientôt disponible. Merci de votre patience.")}
        </p>
        <Link
          href={L("/")}
          className="inline-flex items-center gap-2 bg-gold text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all"
        >
          {t("العودة للرئيسية", "Retour à l'accueil")}
        </Link>
      </div>
    </div>
  );
}
