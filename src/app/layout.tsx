import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Filali Adib - Artiste Joaillier | بيع وشراء الذهب",
  description:
    "خبرة وحِرفية في صناعة وبيع وشراء الذهب في المغرب - Expertise in gold trading in Morocco",
  keywords: [
    "ذهب",
    "مجوهرات",
    "gold",
    "jewelry",
    "or",
    "bijoux",
    "المغرب",
    "morocco",
    "maroc",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
