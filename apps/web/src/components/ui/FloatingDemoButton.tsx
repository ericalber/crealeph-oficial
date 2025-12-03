"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export function FloatingDemoButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <Link
        href="/contact?utm_source=floating-demo&utm_campaign=cta"
        className="group inline-flex items-center gap-2 rounded-md bg-[#E02020] px-5 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-white/20 transition hover:bg-[#C11B1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Calendar className="icon h-4 w-4" aria-hidden />
        <span className="inline-block">Schedule a Demo</span>
      </Link>
    </div>
  );
}
