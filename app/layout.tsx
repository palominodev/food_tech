import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Chicken Food",
  description: "El mejor pollo, rápido y delicioso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 w-full z-50 glass-nav transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">C</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Chicken<span className="text-secondary">Food</span></span>
            </Link>
            <nav className="hidden md:flex gap-8 font-medium">
              <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
              <Link href="/nosotros" className="hover:text-primary transition-colors">Nosotros</Link>
              <Link href="/menu" className="hover:text-primary transition-colors">Menú</Link>
              <Link href="/pedidos/consultar" className="hover:text-primary transition-colors">Consultar pedido</Link>
            </nav>
            <Link href="/pedidos/nuevo" className="bg-secondary hover:bg-secondary-hover text-white px-6 py-2 rounded-full font-semibold transition-transform hover:scale-105 shadow-lg shadow-secondary/30">
              Pedir ahora
            </Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
