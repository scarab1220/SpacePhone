import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";
import { BRANCHES } from "@/data/catalog";

export const Route = createFileRoute("/sucursales/")({
  head: () => ({
    meta: [
      { title: "Sucursales | Space Phone" },
      { name: "description", content: "Visítanos en Metrocentro, Metrosur o Plaza Mundo Soyapango. Conoce direcciones y horarios de nuestras 3 sucursales." },
      { property: "og:title", content: "Sucursales | Space Phone" },
      { property: "og:description", content: "3 sucursales: Metrocentro, Metrosur y Plaza Mundo Soyapango. Encuentra direcciones y horarios." },
      { property: "og:url", content: "/sucursales" },
    ],
    links: [{ rel: "canonical", href: "/sucursales" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Sucursales" }]}
      eyebrow="Visítanos"
      title="Nuestras sucursales"
      icon="store"
      description="Tenemos 3 puntos de venta para atenderte. Conoce direcciones y horarios."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BRANCHES.map((b) => (
          <Link
            key={b.slug}
            to="/sucursales/$slug"
            params={{ slug: b.slug }}
            className="group rounded-2xl bg-surface-container border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-container/50 flex items-center justify-center mb-4 text-primary-bright">
              <span className="material-symbols-outlined">storefront</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-bright mb-1">{b.brand}</p>
            <h2 className="text-lg font-semibold text-on-surface mb-1">{b.name}</h2>
            <p className="text-sm text-on-surface-variant mb-4">{b.city}</p>
            <p className="text-sm text-on-surface-variant mb-4 flex-1">{b.address}</p>
            <span className="text-sm text-primary-bright font-medium inline-flex items-center gap-1">
              Ver detalles <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
          </Link>
        ))}
      </div>
    </InfoPage>
  ),
});
