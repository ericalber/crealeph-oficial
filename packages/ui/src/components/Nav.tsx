import React from "react";
import Link from "next/link";

export const Nav: React.FC = () => (
  <nav className="flex items-center gap-4">
    <Link className="text-sm text-zinc-700 hover:text-black" href="/">Home</Link>
    <Link className="text-sm text-zinc-700 hover:text-black" href="/preco">Preço</Link>
    <Link className="text-sm text-zinc-700 hover:text-black" href="/sobre">Sobre</Link>
  </nav>
);

