"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion";
import { FaLogo } from "@/components/icons";
import { STORE } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, ArrowUp } from "lucide-react";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  return (
    <footer className="bg-secondary text-white relative overflow-hidden">
      {/* Top decorative border */}
      <div className="relative h-[1px]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg width="12" height="12" viewBox="0 0 12 12" className="text-gold/40">
            <path d="M6 0L12 6L6 12L0 6Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 -top-40 w-80 h-80 border border-gold/[0.03] rounded-full"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -left-20 -bottom-20 w-60 h-60 border border-gold/[0.02] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <FadeIn direction="up" delay={0} className="lg:col-span-2">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring" }}>
                  <FaLogo size={30} className="text-gold" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-playfair text-gold font-bold tracking-wider text-sm">
                    FILALI ADIB
                  </span>
                  <span className="text-gold-light/50 text-[10px] tracking-[3px]">
                    ARTISTE JOAILLIER
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                {locale === "ar"
                  ? "حرفي مجوهرات بخبرة تمتد لسنوات في صناعة وبيع وشراء الذهب والمجوهرات الفاخرة في المغرب."
                  : "Joaillier artisan avec des années d'expérience dans la fabrication et la vente d'or et de bijoux de luxe au Maroc."}
              </p>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", href: STORE.social.facebook, path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { label: "Instagram", href: STORE.social.instagram, path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344a3.097 3.097 0 00.748-1.15 3.098 3.098 0 001.15-.748c.353-.137.882-.3 1.857-.344 1.023-.047 1.351-.058 3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" },
                  { label: "WhatsApp", href: STORE.social.whatsapp, path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold/70 hover:bg-gold hover:text-secondary transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
                    aria-label={social.label}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn direction="up" delay={0.1}>
            <div>
              <h3 className="text-gold font-semibold mb-6 relative pb-3">
                {t("footer.quickLinks")}
                <span className="absolute bottom-0 left-0 w-10 h-[2px] bg-gradient-to-r from-gold to-transparent" />
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: t("nav.home") },
                  { href: "/products", label: t("nav.products") },
                  { href: "/about", label: t("nav.about") },
                  { href: "/contact", label: t("nav.contact") },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={L(link.href)}
                      className="text-gray-400 hover:text-gold text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-[1px] bg-gold group-hover:w-2 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Customer Service */}
          <FadeIn direction="up" delay={0.2}>
            <div>
              <h3 className="text-gold font-semibold mb-6 relative pb-3">
                {t("footer.customerService")}
                <span className="absolute bottom-0 left-0 w-10 h-[2px] bg-gradient-to-r from-gold to-transparent" />
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/track", label: locale === "ar" ? "تتبع الطلب" : "Suivi de Commande" },
                  { href: "/privacy", label: locale === "ar" ? "سياسة الخصوصية" : "Confidentialité" },
                  { href: "/terms", label: locale === "ar" ? "الشروط والأحكام" : "Conditions Générales" },
                  { href: "/favorites", label: locale === "ar" ? "المفضلة" : "Favoris" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={L(link.href)}
                      className="text-gray-400 hover:text-gold text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-[1px] bg-gold group-hover:w-2 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Contact Info */}
          <FadeIn direction="up" delay={0.3}>
            <div>
              <h3 className="text-gold font-semibold mb-6 relative pb-3">
                {locale === "ar" ? "معلومات التواصل" : "Contact"}
                <span className="absolute bottom-0 left-0 w-10 h-[2px] bg-gradient-to-r from-gold to-transparent" />
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-400 text-sm">
                  <MapPin size={16} className="text-gold/60 mt-0.5 flex-shrink-0" />
                  <span>{locale === "ar" ? STORE.address.ar : STORE.address.fr}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Phone size={16} className="text-gold/60 flex-shrink-0" />
                  <span dir="ltr">{STORE.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail size={16} className="text-gold/60 flex-shrink-0" />
                  <span>{STORE.email}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-400 text-sm">
                  <Clock size={16} className="text-gold/60 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{locale === "ar" ? "السبت - الخميس" : "Sam - Jeu"}</p>
                    <p>{locale === "ar" ? "9:00 - 19:00" : "9h00 - 19h00"}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-14 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Filali Adib - Artiste Joaillier.{" "}
              {t("footer.copyright")}.
            </p>
            <div className="flex items-center gap-4 text-gray-500 text-xs">
              <Link href={L("/privacy")} className="hover:text-gold transition-colors">
                {locale === "ar" ? "الخصوصية" : "Confidentialité"}
              </Link>
              <span>·</span>
              <Link href={L("/terms")} className="hover:text-gold transition-colors">
                {locale === "ar" ? "الشروط" : "Conditions"}
              </Link>
              <span>·</span>
              <div className="flex items-center gap-1">
                <span>{locale === "ar" ? "صُنع بـ" : "Made with"}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold/50">
                  <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
                </svg>
                <span>{locale === "ar" ? "في فاس" : "à Fès"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
