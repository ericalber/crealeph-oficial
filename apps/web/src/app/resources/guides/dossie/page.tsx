import Link from "next/link";
import React from "react";
import dossie from "@/reports/site-services-audit.md";

export const metadata = {
  title: "Dossiê de Serviços — CreAleph",
  robots: { index: false, follow: false },
};

type Heading = { level: number; text: string; id: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderMarkdown(md: string) {
  const lines = md.split(/\r?\n/);
  const elements: React.ReactElement[] = [];
  const toc: Heading[] = [];
  let i = 0;
  let inCode = false;
  let codeBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = (buf: string[]) => {
    if (buf.length) {
      elements.push(<p key={`p-${elements.length}`} className="mt-3 text-sm text-ink/80">{buf.join(" ")}</p>);
      buf.length = 0;
    }
  };

  let paraBuf: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (inCode) {
        // close
        elements.push(
          <pre key={`code-${elements.length}`} className="mt-4 rounded-[--radius] bg-surface p-3 text-xs text-ink overflow-x-auto">
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        );
        codeBuffer = [];
        inCode = false;
      } else {
        flushParagraph(paraBuf);
        inCode = true;
        codeBuffer = [];
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuffer.push(line);
      i++;
      continue;
    }

    const m = line.match(/^(#{1,6})\s+(.*)$/);
    if (m) {
      flushParagraph(paraBuf);
      if (listBuffer.length) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="mt-3 list-disc pl-6 text-sm text-ink/80">
            {listBuffer.map((li, idx) => <li key={`${idx}-${li.slice(0, 10)}`}>{li}</li>)}
          </ul>
        );
        listBuffer = [];
      }
      const level = m[1].length;
      const text = m[2].trim();
      const id = slugify(text);
      toc.push({ level, text, id });
      const Tag = (`h${Math.min(level, 3)}`) as any;
      elements.push(
        <Tag key={`h-${elements.length}`} id={id} className={level === 1 ? "mt-8 text-2xl font-semibold text-ink" : level === 2 ? "mt-6 text-xl font-semibold text-ink" : "mt-5 text-lg font-semibold text-ink"}>
          {text}
        </Tag>
      );
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-*]\s+/, ""));
      i++;
      continue;
    } else if (listBuffer.length) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="mt-3 list-disc pl-6 text-sm text-ink/80">
          {listBuffer.map((li, idx) => <li key={idx}>{li}</li>)}
        </ul>
      );
      listBuffer = [];
    }

    if (line.trim().length === 0) {
      flushParagraph(paraBuf);
      i++;
      continue;
    }

    paraBuf.push(line.trim());
    i++;
  }

  // flush leftovers
  flushParagraph(paraBuf);
  if (listBuffer.length) {
    elements.push(
      <ul key={`ul-${elements.length}`} className="mt-3 list-disc pl-6 text-sm text-ink/80">
        {listBuffer.map((li, idx) => <li key={idx}>{li}</li>)}
      </ul>
    );
  }

  return { elements, toc };
}

export default async function DossieGuidePage() {
  const { elements, toc } = renderMarkdown(dossie as unknown as string);
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-screen-xl space-y-8 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.3em] text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/resources/guides" className="underline-offset-4 hover:underline">Guias</Link>
          <span className="mx-2">›</span>
          <span className="text-ink">Dossiê</span>
        </nav>

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-ink">Dossiê de Serviços</h1>
          <p className="text-sm text-muted">Inventário, paridade técnica, gaps, SWOT e roadmap</p>
        </header>

        {toc.length > 0 && (
          <aside className="rounded-[--radius] border border-line bg-white p-4">
            <h2 className="text-base font-semibold text-ink">Sumário</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {toc.map((h, idx) => (
                <li key={idx} className={h.level > 2 ? "ml-4" : ""}>
                  <a href={`#${h.id}`} className="underline-offset-4 hover:underline text-ink/80">{h.text}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <article className="space-y-2">
          {elements}
        </article>
      </div>
    </section>
  );
}
