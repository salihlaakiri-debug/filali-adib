"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion";
import { FaLogo } from "@/components/icons";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  return (
    <footer className="bg-secondary text-white relative overflow-hidden">
      {/* Top decorative line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <FadeIn direction="up" delay={0}>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <motion.div whileHover={{ rotate: 12 }} transition={{ type: "spring" }}>
                  <FaLogo size={28} className="text-gold" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-playfair text-gold font-bold tracking-wider text-sm">
                    FILALI ADIBE
                  </span>
                  <span className="text-gold-light text-[10px] tracking-[3px]">
                    ARTISTE JOAILLIER
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{t("footer.aboutText")}</p>
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn direction="up" delay={0.1}>
            <div>
              <h3 className="text-gold font-semibold mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-gold/40">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-3">
                {[{ href: "/", label: t("nav.home") }, { href: "/products", label: t("nav.products") }, { href: "/about", label: t("nav.about") }, { href: "/contact", label: t("nav.contact") }].map((link) => (
                  <li key={link.href}>
                    <Link href={L(link.href)} className="text-gray-400 hover:text-gold text-sm transition-all duration-300 hover:translate-x-1 inline-block">
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
              <h3 className="text-gold font-semibold mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-gold/40">
                {t("footer.customerService")}
              </h3>
              <ul className="space-y-3">
                {[{ href: "/shipping", label: t("product.shipping") }, { href: "/returns", label: t("product.returns") }, { href: "/faq", label: "FAQ" }, { href: "/privacy", label: locale === "fr" ? "Politique de Confidentialité" : locale === "en" ? "Privacy Policy" : "سياسة الخصوصية" }, { href: "/terms", label: locale === "fr" ? "Conditions Générales" : locale === "en" ? "Terms & Conditions" : "الشروط والأحكام" }].map((link) => (
                  <li key={link.href}>
                    <Link href={L(link.href)} className="text-gray-400 hover:text-gold text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Follow Us */}
          <FadeIn direction="up" delay={0.3}>
            <div>
              <h3 className="text-gold font-semibold mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-gold/40">
                {t("footer.followUs")}
              </h3>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { label: "Instagram", path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344a3.097 3.097 0 00.748-1.15 3.098 3.098 0 001.15-.748c.353-.137.882-.3 1.857-.344 1.023-.047 1.351-.058 3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" },
                  { label: "Twitter", path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold hover:bg-gold hover:text-secondary transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="border-t border-gray-800/50 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Filali Adib - Artiste Joaillier.{" "}
            {t("footer.copyright")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
