"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User, Heart, LogIn } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { FaLogo } from "@/components/icons";

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { data: session } = useSession();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.products") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-secondary/98 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-gold/10"
          : "bg-secondary/95 backdrop-blur-sm border-b border-gold/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={L("/")} className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={L(link.href)}
                className="relative text-white hover:text-gold transition-colors text-sm py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white hover:text-gold transition-colors"
            >
              <Search size={20} />
            </motion.button>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href={L("/favorites")}
                className="text-white hover:text-gold transition-colors hidden sm:block"
              >
                <Heart size={20} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Link
                href={L("/cart")}
                className="text-white hover:text-gold transition-colors"
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-gold text-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href={L("/login")}
                className="text-white hover:text-gold transition-colors hidden sm:block"
              >
                <User size={20} />
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-white hover:text-gold transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="md:hidden overflow-hidden border-t border-gold/20"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      href={L(link.href)}
                      className="block py-3 px-4 text-white hover:text-gold hover:bg-gold/5 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-gold/10 my-3" />
                {session ? (
                  <>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.32 }}>
                      <Link href={L("/account")} className="block py-3 px-4 text-white hover:text-gold hover:bg-gold/5 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                        {t("nav.account")}
                      </Link>
                    </motion.div>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                      <Link href={L("/favorites")} className="block py-3 px-4 text-white hover:text-gold hover:bg-gold/5 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                        {t("nav.favorites")}
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.32 }}>
                    <Link href={L("/login")} className="flex items-center gap-3 py-3 px-4 text-gold hover:bg-gold/5 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                      <LogIn size={18} />
                      {t("nav.login")}
                    </Link>
                  </motion.div>
                )}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.48 }}>
                  <Link href={L("/cart")} className="flex items-center justify-between py-3 px-4 text-white hover:text-gold hover:bg-gold/5 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
                    <span>{t("nav.cart")}</span>
                    {itemCount > 0 && <span className="bg-gold text-secondary text-xs px-2 py-0.5 rounded-full font-bold">{itemCount}</span>}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
