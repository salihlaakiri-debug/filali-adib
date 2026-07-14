import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AdminRedirect } from "@/components/shared/AdminRedirect";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminRedirect />
      <Navbar />
      <main className="flex-1 pt-[80px]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
