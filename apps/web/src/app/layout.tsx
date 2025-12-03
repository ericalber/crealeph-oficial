import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans } from "next/font/google";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import "@/theme/tokens.css";
import "@/theme/dashboard-tokens.css";
import "@/styles/globals.css";
import "../styles/shine.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreAleph",
  description: "Experiências digitais com automação inteligente.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

function isDashboardPath() {
  const hdrs = headers();
  const path =
    hdrs.get("x-invoke-path") ??
    hdrs.get("x-matched-path") ??
    hdrs.get("next-url") ??
    hdrs.get("referer") ??
    "";
  return path.startsWith("/app");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dashboard = isDashboardPath();

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${dmSans.className} bg-[#FFFFFF] text-[#0B0B0E] antialiased`}>
        {dashboard ? children : <MarketingChrome>{children}</MarketingChrome>}
      </body>
    </html>
  );
}
