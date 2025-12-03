"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingDemoButton } from "@/components/ui/FloatingDemoButton";

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname?.startsWith("/app");

  if (isApp) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <FloatingDemoButton />
      <Footer />
    </>
  );
}
