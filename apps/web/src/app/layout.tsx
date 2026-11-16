import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Sentença Digital — Tribunal de Casos sobre IA",
  description: "Sentença Digital: um tribunal digital para investigar casos reais envolvendo o uso irresponsável de IA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
