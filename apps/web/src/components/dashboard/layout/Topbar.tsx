"use client";

import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-end gap-4 border-b bg-[var(--surface)] px-6 py-3"
      style={{ borderColor: "var(--line)" }}
    >
      <button
        onClick={() => {
          router.push("/");
        }}
        className="rounded-[var(--radius-sm)] border px-3 py-1.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
        style={{ borderColor: "var(--line)" }}
      >
        Logout
      </button>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-bold text-[var(--ink)]">
        CA
      </div>
    </div>
  );
}
