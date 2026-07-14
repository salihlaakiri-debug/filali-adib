import { useTranslations } from "next-intl";
import { Hero } from "@/components/shared/Hero";
import { FeaturedProducts } from "@/components/shared/FeaturedProducts";
import { Categories } from "@/components/shared/Categories";
import { AboutSection } from "@/components/shared/AboutSection";
import { StatsSection } from "@/components/shared/StatsSection";
import { Testimonials } from "@/components/shared/Testimonials";
import { TrustBadges } from "@/components/shared/TrustBadges";
import { Newsletter } from "@/components/shared/Newsletter";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <StatsSection />
      <TrustBadges />
      <AboutSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
