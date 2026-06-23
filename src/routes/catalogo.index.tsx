import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Breadcrumbs, CategoryGrid } from "@/components/PageLayout";
import { fetchNavigation, type Category } from "@/lib/catalog.queries";
import heroBg from "@/assets/hero-catalogo.jpg";

export const Route = createFileRoute("/catalogo/")({
  head: () => ({
    meta: [
      { title: "Catálogo | Space Phone" },
      {
        name: "description",
        content:
          "Smartphones y accesorios. Explora todas las categorías del catálogo de Space Phone.",
      },
      { property: "og:title", content: "Catálogo | Space Phone" },
      {
        property: "og:description",
        content: "Smartphones y accesorios. Explora todas las categorías.",
      },
      { property: "og:url", content: "/catalogo" },
    ],
    links: [{ rel: "canonical", href: "/catalogo" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Catálogo Space Phone",
          description: "Smartphones y accesorios. Explora todas las categorías.",
          url: "/catalogo",
        }),
      },
    ],
  }),
  component: CatalogIndex,
});

function CatalogIndex() {
  const [cats, setCats] = useState<Category[] | null>(null);

  useEffect(() => {
    fetchNavigation()
      .then(setCats)
      .catch(() => setCats([]));
  }, []);

  return (
    <main className="min-h-screen pb-24">
      <Breadcrumbs trail={[{ label: "Inicio", to: "/" }, { label: "Catálogo" }]} />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-on-primary-container bg-primary-container rounded-full">
            <span className="material-symbols-outlined text-sm">shopping_bag</span>
            Tienda
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-on-surface tracking-tight mb-6">
            Catálogo
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
            Todo lo que necesitas: smartphones, accesorios y más.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8">
        {cats === null ? (
          <p className="text-on-surface-variant">Cargando catálogo…</p>
        ) : cats.length === 0 ? (
          <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl text-primary-bright mb-3 block">
              inventory_2
            </span>
            Aún no hay categorías publicadas.
          </div>
        ) : (
          <CategoryGrid
            subcategories={cats.map((c) => ({
              name: c.title,
              description: c.description,
              icon: c.icon,
              to: "/catalogo/$categoria",
              params: { categoria: c.slug },
            }))}
          />
        )}
      </section>
    </main>
  );
}
