import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-4 py-28">
      <div className="mx-auto max-w-screen-md text-center">
        <h1 className="text-3xl font-bold text-ink">Página não encontrada</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))]">
          Não encontramos o que você procura. Volte para a
          {" "}
          <Link href="/" className="text-brand underline-offset-4 hover:underline">página inicial</Link>.
        </p>
      </div>
    </section>
  );
}

