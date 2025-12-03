import "./globals.css";
import React from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="mx-auto max-w-6xl px-6">
          <header className="flex items-center justify-between min-h-[70px] md:min-h-[90px] py-6">
            <Link href="/" className="text-xl font-semibold">CreAleph Admin</Link>
            <nav className="flex items-center gap-3">
              <Link className="text-sm text-zinc-700 hover:text-black" href="/usuarios">Usuários</Link>
              <Link className="text-sm text-zinc-700 hover:text-black" href="/dashboard-executivo">Dashboard</Link>
            </nav>
          </header>
          <main className="py-4">{children}</main>
        </div>
      </body>
    </html>
  );
}

