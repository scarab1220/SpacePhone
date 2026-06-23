import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs, PageHero, ProductGrid } from "@/components/PageLayout";
import { fetchSubcategory } from "@/lib/catalog.queries";

export const Route = createFileRoute("/catalogo/$categoria/$subcategoria")({
  loader: async ({ params }) => {
    const data = await fetchSubcategory(params.categoria, params.subcategoria);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const sub = loaderData?.sub;
    const products = loaderData?.products ?? [];
    const title = sub
      ? `${sub.title} | ${sub.categoryTitle} | Space Phone`
      : `${params.subcategoria} | ${params.categoria} | Space Phone`;
    const description = sub
      ? (sub.description ??
        `${sub.title} en ${sub.categoryTitle}: ${products.length} producto${products.length === 1 ? "" : "s"} con garantía en Space Phone.`)
      : "Subcategoría del catálogo de Space Phone.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/catalogo/${params.categoria}/${params.subcategoria}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/catalogo/${params.categoria}/${params.subcategoria}` }],
      scripts: sub
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: sub.title,
                description,
                url: `/catalogo/${params.categoria}/${sub.slug}`,
                isPartOf: {
                  "@type": "CollectionPage",
                  name: sub.categoryTitle,
                  url: `/catalogo/${params.categoria}`,
                },
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen pt-32 px-4 text-on-surface-variant">
      Subcategoría no encontrada.
    </main>
  ),
  errorComponent: () => (
    <main className="min-h-screen pt-32 px-4 text-on-surface-variant">
      No pudimos cargar la subcategoría.
    </main>
  ),
  component: SubcategoryPage,
});

function SubcategoryPage() {
  const { categoria } = Route.useParams();
  const { sub, products } = Route.useLoaderData();
  return (
    <main className="min-h-screen pb-24">
      <Breadcrumbs
        trail={[
          { label: "Inicio", to: "/" },
          { label: "Catálogo", to: "/catalogo" },
          { label: sub.categoryTitle, to: "/catalogo/$categoria", params: { categoria } },
          { label: sub.title },
        ]}
      />
      <PageHero
        eyebrow={sub.categoryTitle}
        title={sub.title}
        description={sub.description ?? undefined}
        icon={sub.icon ?? "label"}
      />
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
