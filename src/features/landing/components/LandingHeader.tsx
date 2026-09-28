import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "El problema", href: "#problema" },
  { label: "La propuesta", href: "#propuesta" },
  { label: "Nuestro criterio", href: "#criterio" },
] as const;

export function LandingHeader() {
  return (
    <header className="relative z-30 border-b border-[#E5EBE6] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-10 lg:px-16">
        <Link
          href="/home"
          className="inline-flex shrink-0"
          aria-label="TAKYA, volver al inicio"
        >
          <Image
            src="/brand/principal-bosque.svg"
            alt="TAKYA"
            width={178}
            height={35}
            priority
            className="h-auto w-36 sm:w-44"
          />
        </Link>

        <nav
          aria-label="Secciones del proyecto"
          className="hidden items-center gap-8 text-sm font-medium text-forest md:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#5A8067]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-xs font-semibold text-ivory transition-colors hover:bg-[#2D5940] sm:px-5 sm:text-sm"
        >
          Explorar demo
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
