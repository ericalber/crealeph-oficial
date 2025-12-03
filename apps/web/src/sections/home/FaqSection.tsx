'use client';

import { useState } from "react";

const faqs = [
  {
    question: "What industries have you worked most?",
    answer:
      "Atuamos com startups de tecnologia, SaaS, saúde, finanças e agências criativas. Adaptamos processos ao contexto de cada equipe para gerar impacto mensurável.",
  },
  {
    question: "Do you work solo or with a team?",
    answer:
      "Escalamos squads multidisciplinares conforme o escopo: estrategistas, designers de produto, engenheiros fullstack e especialistas em dados.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Projetos rápidos de descoberta levam 2–4 semanas. Produtos completos variam entre 8–16 semanas, com entregas quinzenais e acompanhamento contínuo.",
  },
  {
    question: "Do you offer development services?",
    answer:
      "Sim. Construímos aplicações web e mobile com pipelines DevOps, testes automatizados e monitoramento contínuo após o lançamento.",
  },
  {
    question: "Can you help improve my design?",
    answer:
      "Oferecemos auditorias de UX, evoluções de design system e squads de sustentação para manter sua interface atualizada e consistente.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            Frequently Asked Questions
          </span>
          <h2 className="text-h2 font-semibold text-ink">
            Answers to Questions Ask Me
          </h2>
          <p className="text-base text-muted">
            Se não encontrar o que precisa, fale direto com a gente. Respondemos
            em até 24h úteis.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((item, index) => {
            const open = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-[--radius] border border-line bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="text-base font-semibold text-ink">
                    {item.question}
                  </span>
                  <span className="text-brand">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <div className="border-t border-line/60 px-6 py-5 text-sm text-muted">
                    {item.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
