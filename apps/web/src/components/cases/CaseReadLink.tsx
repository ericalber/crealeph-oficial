import Link from "next/link";

type CaseReadLinkProps = {
  href: string | undefined | null;
  label?: string;
};

export function CaseReadLink({ href, label }: CaseReadLinkProps) {
  if (process.env.NEXT_PUBLIC_SHOW_CASE_READ_LINKS !== "true") return null;
  if (!href) return null;
  return (
    <Link href={href} className="link-cta">
      {label ?? "Ver estudo completo"}
    </Link>
  );
}

