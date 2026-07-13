import { useTranslations } from "next-intl";
import { Hero } from "@/components/shared/Hero";
import { FeaturedProducts } from "@/components/shared/FeaturedProducts";
import { Categories } from "@/components/shared/Categories";
import { AboutSection } from "@/components/shared/AboutSection";
import { Newsletter } from "@/components/shared/Newsletter";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <AboutSection />
      <Newsletter />
    </div>
  );
}
