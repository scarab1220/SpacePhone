import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { fetchFeatured, fetchNavigation, type Category, type Product } from "@/lib/catalog.queries";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Space Phone | Smartphones y accesorios" },
      { name: "description", content: "Smartphones nuevos y seminuevos, accesorios originales y pagos en línea. Envíos a todo el país." },
      { property: "og:title", content: "Space Phone | Smartphones y accesorios" },
      { property: "og:description", content: "Smartphones nuevos y seminuevos, accesorios y pagos en línea." },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroBg, fetchpriority: "high" } as any,
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetchNavigation().then(setCategories).catch(console.warn);
    fetchFeatured(8).then(setFeatured).catch(console.warn);
  }, []);

  return (
    <main className="min-h-screen pb-24">
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} fetchPriority="high" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-on-primary-container bg-primary-container rounded-full">
            Tu tienda de smartphones
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-on-surface tracking-tight mb-6">
            Space Phone — Tu tienda de smartphones y accesorios
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8">
            Smartphones nuevos y seminuevos, accesorios originales y pagos en línea con garantía.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/catalogo" className="px-6 py-3 rounded-full btn-primary text-white font-semibold inline-flex items-center gap-2">
              Ver catálogo <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/contacto" className="px-6 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold">
              Contacto
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
          <h2 className="text-3xl font-bold text-on-surface mb-6">Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to="/catalogo/$categoria"
                params={{ categoria: cat.slug }}
                className="group relative rounded-2xl bg-surface-container border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-magenta/10 rounded-full blur-2xl group-hover:bg-brand-magenta/30 transition-all" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/50 flex items-center justify-center mb-4 text-primary-bright">
                    <span className="material-symbols-outlined">{cat.icon ?? "category"}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface mb-1">{cat.title}</h3>
                  {cat.description && <p className="text-sm text-on-surface-variant mb-4">{cat.description}</p>}
                  <span className="inline-flex items-center gap-1 text-sm text-primary-bright font-medium">
                    Explorar
                    <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
          <h2 className="text-3xl font-bold text-on-surface mb-6">Productos destacados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {categories.length === 0 && featured.length === 0 && (
        <section className="max-w-3xl mx-auto px-4 md:px-8 mt-12 text-center">
          <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-8">
            <span className="material-symbols-outlined text-5xl text-primary-bright mb-3 block">inventory_2</span>
            <h2 className="text-xl font-semibold text-on-surface mb-2">Catálogo en preparación</h2>
            <p className="text-on-surface-variant mb-4">El cliente está cargando productos. Vuelve pronto.</p>
            <Link to="/contacto" className="text-primary-bright hover:underline">Mientras tanto, contáctanos</Link>
          </div>
        </section>
      )}
    </main>
  );
}
