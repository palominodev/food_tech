import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
            alt="Restaurant interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/70 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-48 flex flex-col items-start w-full animate-fade-in-up">
          <span className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
            Sabor Auténtico
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 max-w-2xl">
            Una experiencia <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              fresca y deliciosa
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-lg mb-10 leading-relaxed font-medium">
            Descubre la fusión perfecta entre ingredientes locales y técnicas modernas en un ambiente inigualable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/menu"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1 shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
            >
              Ver el menú
            </Link>
            <Link
              href="/pedidos/nuevo"
              className="bg-surface text-foreground border border-foreground/10 hover:border-foreground/20 px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Hacer pedido
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
