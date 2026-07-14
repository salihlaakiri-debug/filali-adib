"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User, Heart, LogIn, ChevronDown, Diamond, TrendingUp, TrendingDown } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { FaLogo } from "@/components/icons";

interface GoldPrice { price18k: number; currency: string; updatedAt: string; change?: number; changePercent?: number; }

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { data: session } = useSession();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    if (currentScrollY < 50) {
      setHidden(false);
      setScrolled(false);
    } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
      setHidden(true);
      setIsOpen(false);
    } else if (currentScrollY < lastScrollY) {
      setHidden(false);
    }
    setScrolled(currentScrollY > 20);
    setLastScrollY(currentScrollY);
  });

  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  useEffect(() => {
    fetch("/api/gold-price")
      .then((r) => r.json())
      .then((d) => setGoldPrice({ price18k: d.price18k, currency: d.currency || "MAD", updatedAt: d.updatedAt, change: d.change, changePercent: d.changePercent }))
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.products") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-secondary/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-gold/10 py-1"
          : "bg-secondary/90 backdrop-blur-sm border-b border-gold/15 py-0"
      }`}
    >
      {/* Gold Price Strip */}
      {goldPrice && (
        <div className="bg-secondary border-b border-gold/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 py-1.5 text-xs">
              <Diamond size={10} className="text-gold/60" />
              <span className="text-gold/80 font-medium">سعر الذهب</span>
              <span className="text-gray-600">|</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={goldPrice.price18k}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gold font-bold"
                >
                  {goldPrice.price18k.toLocaleString()} د.م/غ
                </motion.span>
              </AnimatePresence>
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">عيار 18</span>
              {goldPrice.change !== undefined && goldPrice.change !== 0 && (
                <span className={`flex items-center gap-0.5 ${(goldPrice.change || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {(goldPrice.change || 0) >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  <span>{(goldPrice.change || 0) >= 0 ? "+" : ""}{goldPrice.changePercent?.toFixed(1)}%</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={L("/")} className="flex items-center gap-2.5 group relative">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative"
            >
              <FaLogo size={30} className="text-gold" />
              <motion.div
                className="absolute inset-0 bg-gold/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ scale: 1.5 }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-playfair text-gold font-bold tracking-wider text-sm">
                FILALI ADIB
              </span>
              <span className="text-gold-light/60 text-[10px] tracking-[3px]">
                ARTISTE JOAILLIER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={L(link.href)}
                className="relative text-white/80 hover:text-gold transition-colors text-sm py-2 px-4 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-3/4 rounded-full" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[6px] bg-gold/10 transition-all duration-300 group-hover:w-3/4 rounded-full blur-sm" />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {[
              {
                icon: <Search size={18} />,
                label: "search",
                href: undefined,
                onClick: () => {},
                show: true,
              },
              {
                icon: <Heart size={18} />,
                label: "favorites",
                href: L("/favorites"),
                onClick: undefined,
                show: true,
                desktop: true,
              },
              {
                icon: <User size={18} />,
                label: session ? "account" : "login",
                href: L(session ? "/account" : "/login"),
                onClick: undefined,
                show: true,
                desktop: true,
              },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={action.onClick}
                className={`text-white/70 hover:text-gold transition-all duration-300 relative p-2 rounded-full hover:bg-gold/5 ${
                  action.desktop ? "hidden sm:block" : ""
                }`}
              >
                {action.href ? (
                  <Link href={action.href} className="flex items-center justify-center">
                    {action.icon}
                  </Link>
                ) : (
                  action.icon
                )}
              </motion.button>
            ))}

            {/* Cart with badge */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Link
                href={L("/cart")}
                className="text-white/70 hover:text-gold transition-all duration-300 p-2 rounded-full hover:bg-gold/5 flex items-center justify-center"
              >
                <ShoppingBag size={18} />
              </Link>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, y: 5 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 5 }}
                    className="absolute -top-0.5 -right-0.5 bg-gold text-secondary text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-gold/30"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-white/80 hover:text-gold transition-colors p-2 ml-1"
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
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={22} />
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
              className="md:hidden overflow-hidden border-t border-gold/15"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={L(link.href)}
                      className="flex items-center gap-3 py-3 px-4 text-white/80 hover:text-gold hover:bg-gold/5 rounded-xl transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent my-3" />

                {session ? (
                  <>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.24 }}>
                      <Link href={L("/account")} className="flex items-center gap-3 py-3 px-4 text-white/80 hover:text-gold hover:bg-gold/5 rounded-xl transition-all duration-200" onClick={() => setIsOpen(false)}>
                        <User size={18} />
                        {t("nav.account")}
                      </Link>
                    </motion.div>
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                      <Link href={L("/favorites")} className="flex items-center gap-3 py-3 px-4 text-white/80 hover:text-gold hover:bg-gold/5 rounded-xl transition-all duration-200" onClick={() => setIsOpen(false)}>
                        <Heart size={18} />
                        {t("nav.favorites")}
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.24 }}>
                    <Link href={L("/login")} className="flex items-center gap-3 py-3 px-4 text-gold hover:bg-gold/5 rounded-xl transition-all duration-200" onClick={() => setIsOpen(false)}>
                      <LogIn size={18} />
                      {t("nav.login")}
                    </Link>
                  </motion.div>
                )}

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.36 }}>
                  <Link href={L("/cart")} className="flex items-center justify-between py-3 px-4 text-white/80 hover:text-gold hover:bg-gold/5 rounded-xl transition-all duration-200" onClick={() => setIsOpen(false)}>
                    <span className="flex items-center gap-3">
                      <ShoppingBag size={18} />
                      {t("nav.cart")}
                    </span>
                    {itemCount > 0 && (
                      <span className="bg-gold text-secondary text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {itemCount}
                      </span>
                    )}
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
