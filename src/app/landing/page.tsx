import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/LandingPage";

const description =
  "TAKYA ayuda a operadores de cámaras a revisar grabaciones, entender cada caso y entregar evidencia verificable. Sin biometría, local y con la decisión siempre en manos de una persona.";

export const metadata: Metadata = {
  metadataBase: new URL("https://takya.cl"),
  title: "TAKYA | Videovigilancia con criterio humano · Antofagasta, Chile",
  description,
  keywords: [
    "videovigilancia",
    "televigilancia",
    "CCTV",
    "central de cámaras",
    "operador de cámaras",
    "evidencia digital",
    "cadena de custodia",
    "seguridad municipal",
    "seguridad privada",
    "Antofagasta",
    "Chile",
  ],
  alternates: { canonical: "/landing" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "TAKYA",
    title: "TAKYA | Comprender antes de actuar",
    description,
    url: "/landing",
  },
};

// Datos estructurados para buscadores (schema.org).
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TAKYA",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  description,
  inLanguage: "es-CL",
  areaServed: "CL",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON estático del propio sitio, sin datos de usuarios.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage />
    </>
  );
}
