import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/catalog.queries";

export function PageHero({ eyebrow, title, description, icon }: { eyebrow?: string; title: string; description?: string; icon?: string }) {
  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-magenta/30 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {eyebrow && (
          <div className="flex items-center gap-2 mb-3">
            {icon === "apple" ? (
              <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current text-primary-bright" aria-hidden="true">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM256.6 102.4c29.5-35 26.8-66.9 25.9-78.4-26 1.5-56.1 17.7-73.2 37.7-18.9 21.4-30 47.9-27.6 78.4 28.1 2.2 53.7-12.2 74.9-37.7z"/>
              </svg>
            ) : (
              <span className="material-symbols-outlined text-primary-bright">{icon}</span>
            )}
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-bright">{eyebrow}</span>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-bold text-on-surface tracking-tight mb-4">{title}</h1>
        {description && (
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}

export function Breadcrumbs({ trail }: { trail: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-2 text-xs text-on-surface-variant flex items-center gap-2 flex-wrap">
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-2">
          {t.to ? (
            <Link to={t.to} params={t.params as never} className="hover:text-primary-bright transition-colors">{t.label}</Link>
          ) : (
            <span className="text-on-surface">{t.label}</span>
          )}
          {i < trail.length - 1 && <span className="material-symbols-outlined text-xs">chevron_right</span>}
        </span>
      ))}
    </nav>
  );
}

export function ProductGrid({ products, emptyMessage = "Aún no hay productos en esta sección." }: { products: Product[]; emptyMessage?: string }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-12 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl text-primary-bright mb-3 block">inventory_2</span>
        {emptyMessage}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}

export function CategoryGrid({
  subcategories,
}: {
  subcategories: { name: string; description?: string | null; icon?: string | null; to: string; params?: Record<string, string> }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {subcategories.map((s) => (
        <Link
          key={s.to + JSON.stringify(s.params ?? {})}
          to={s.to}
          params={s.params as never}
          className="group relative rounded-2xl bg-surface-container border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-magenta/10 rounded-full blur-2xl group-hover:bg-brand-magenta/30 transition-all" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary-container/50 flex items-center justify-center mb-4 text-primary-bright">
              {s.icon === "apple" ? (
                <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current" aria-hidden="true">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM256.6 102.4c29.5-35 26.8-66.9 25.9-78.4-26 1.5-56.1 17.7-73.2 37.7-18.9 21.4-30 47.9-27.6 78.4 28.1 2.2 53.7-12.2 74.9-37.7z"/>
                </svg>
              ) : (
                <span className="material-symbols-outlined">{s.icon ?? "category"}</span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-on-surface mb-1">{s.name}</h2>
            {s.description && <p className="text-sm text-on-surface-variant mb-4">{s.description}</p>}
            <span className="inline-flex items-center gap-1 text-sm text-primary-bright font-medium">
              Ver productos
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function InfoPage({
  breadcrumbs,
  eyebrow,
  title,
  description,
  icon,
  children,
}: {
  breadcrumbs: { label: string; to?: string }[];
  eyebrow: string;
  title: string;
  description?: string;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen pb-24">
      <Breadcrumbs trail={breadcrumbs} />
      <PageHero eyebrow={eyebrow} title={title} description={description} icon={icon} />
      <section className="max-w-4xl mx-auto px-4 md:px-8">{children}</section>
    </main>
  );
}
