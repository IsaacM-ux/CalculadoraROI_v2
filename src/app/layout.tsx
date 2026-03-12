import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculadora ROI Drones Agrícolas — ¿Cuánto puedes ahorrar?",
  description:
    "Calcula el retorno de inversión de usar drones para fumigación y siembra. Compara costos: método manual vs tractor vs drone.",
  openGraph: {
    title: "Calculadora ROI Drones Agrícolas",
    description: "Compara costos: manual vs tractor vs drone. Calcula tu ahorro anual.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
