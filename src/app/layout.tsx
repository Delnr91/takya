import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import "../components/ui/cojeev.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TAKYA | Comprender antes de actuar",
  description:
    "Asistente de contexto y priorización explicable para operadores de televigilancia. Prototipo interactivo del Programa Nómada UCN.",
  icons: { icon: "/brand/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" data-scroll-behavior="smooth">
      <body
        className={`${sora.variable} ${jakarta.variable} ${jetbrains.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
