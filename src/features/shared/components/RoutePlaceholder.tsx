import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type RoutePlaceholderProps = {
  index: string;
  title: string;
  description: string;
};

export function RoutePlaceholder({
  index,
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <main className="flex min-h-dvh flex-col justify-between bg-dark-deep p-6 text-ivory sm:p-10">
      <Link
        href="/home"
        aria-label="Volver al inicio de TAKYA"
        className="w-fit"
      >
        <Image
          src="/brand/logotipo-marfil.svg"
          alt="TAKYA"
          width={160}
          height={37}
          priority
        />
      </Link>
      <section className="max-w-2xl">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-sage">
          {index}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory opacity-80 sm:text-lg">
          {description}
        </p>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.12em] text-sage">
          Página en construcción
        </p>
        <Link
          href="/home"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-sage px-5 py-3 text-sm font-medium transition-colors hover:bg-forest"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Volver al inicio
        </Link>
      </section>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
        Simulación interactiva para validación conceptual
      </p>
    </main>
  );
}
