"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  nameKey: string;
  rating: number;
  reviewKey: string;
  locationKey: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    nameKey: "name1",
    rating: 5,
    reviewKey: "review1",
    locationKey: "location1",
  },
  {
    id: 2,
    nameKey: "name2",
    rating: 5,
    reviewKey: "review2",
    locationKey: "location2",
  },
  {
    id: 3,
    nameKey: "name3",
    rating: 4,
    reviewKey: "review3",
    locationKey: "location3",
  },
  {
    id: 4,
    nameKey: "name4",
    rating: 5,
    reviewKey: "review4",
    locationKey: "location4",
  },
  {
    id: 5,
    nameKey: "name5",
    rating: 5,
    reviewKey: "review5",
    locationKey: "location5",
  },
  {
    id: 6,
    nameKey: "name6",
    rating: 4,
    reviewKey: "review6",
    locationKey: "location6",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? "fill-gold text-gold"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");

  return (
    <section className="py-24 px-4 bg-[#F9FAFB] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/[0.02] rounded-full blur-3xl" />

      <motion.div
        className="absolute top-32 right-16 hidden lg:block"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" className="text-gold/[0.06]">
          <path d="M14 0L28 14L14 28L0 14Z" fill="currentColor" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-12 hidden lg:block"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      >
        <svg width="22" height="22" viewBox="0 0 28 28" className="text-gold/[0.05]">
          <path d="M14 0L28 14L14 28L0 14Z" fill="currentColor" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-1/4 hidden lg:block"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg width="16" height="16" viewBox="0 0 28 28" className="text-gold/[0.04]">
          <path d="M14 0L28 14L14 28L0 14Z" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto relative">
        <FadeIn direction="up" className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold/60">
              <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
            </svg>
            <div className="h-[1px] w-12 bg-gold/40" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold/60">
              <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
            </svg>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
          </motion.div>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-secondary mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-500 mt-6 max-w-lg mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.12}>
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <motion.div
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-2xl border border-gray-100 p-8 h-full flex flex-col hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
              >
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                <div className="flex items-center justify-between mb-5">
                  <StarRating rating={testimonial.rating} />
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-gold/15">
                    <path
                      d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.192 11 15c0 1.933-1.567 3.5-3.5 3.5-1.19 0-2.308-.586-2.917-1.179zM16.583 17.321C15.553 16.227 15 15 15 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C21.591 11.69 23 13.192 23 15c0 1.933-1.567 3.5-3.5 3.5-1.19 0-2.308-.586-2.917-1.179z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 flex-1 text-sm">
                  {t(testimonial.reviewKey)}
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">
                      {t(testimonial.nameKey).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary text-sm">
                      {t(testimonial.nameKey)}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold/40">
                        <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
                      </svg>
                      {t(testimonial.locationKey)}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-center rounded-b-2xl" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
