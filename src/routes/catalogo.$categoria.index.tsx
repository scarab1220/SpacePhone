import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Breadcrumbs, PageHero, CategoryGrid } from "@/components/PageLayout";
import { fetchCategory, type Subcategory } from "@/lib/catalog.queries";

export const Route = createFileRoute("/catalogo/$categoria/")({
  loader: async ({ params }) => {
    if (params.categoria === "$categoria") {
      throw redirect({ to: "/catalogo" });
    }
    const cat = await fetchCategory(params.categoria);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData, params }) => {
    const cat = loaderData?.cat;
    const title = cat ? `${cat.title} | Catálogo Space Phone` : `${params.categoria} | Catálogo Space Phone`;
    const description = cat
      ? (cat.description ?? `Explora ${cat.title} en el catálogo de Space Phone: ${cat.subcategories.length} subcategorías con smartphones y accesorios.`)
      : "Categoría del catálogo de Space Phone.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/catalogo/${params.categoria}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/catalogo/${params.categoria}` }],
      scripts: cat
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: cat.title,
                description,
                url: `/catalogo/${cat.slug}`,
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen pt-32 px-4 text-on-surface-variant">Categoría no encontrada.</main>
  ),
  errorComponent: () => (
    <main className="min-h-screen pt-32 px-4 text-on-surface-variant">No pudimos cargar la categoría.</main>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  return (
    <main className="min-h-screen pb-24">
      <Breadcrumbs trail={[{ label: "Inicio", to: "/" }, { label: "Catálogo", to: "/catalogo" }, { label: cat.title }]} />
      <PageHero eyebrow="Catálogo" title={cat.title} description={cat.description ?? undefined} icon={cat.icon ?? "category"} />
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        {cat.subcategories.length === 0 ? (
          <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-12 text-center text-on-surface-variant">
            Aún no hay subcategorías en {cat.title}.
          </div>
        ) : (
          <CategoryGrid
            subcategories={cat.subcategories.map((s: Subcategory) => ({
              name: s.title,
              description: s.description,
              icon: s.icon,
              to: "/catalogo/$categoria/$subcategoria",
              params: { categoria: cat.slug, subcategoria: s.slug },
            }))}
          />
        )}
      </section>
    </main>
  );
}
