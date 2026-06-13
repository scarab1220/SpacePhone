import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs } from "@/components/PageLayout";
import { useCart } from "@/lib/cart";
import { SOCIAL_LINKS, PLACEHOLDER_IMG } from "@/data/catalog";
import { fetchProduct, formatPrice } from "@/lib/catalog.queries";

function truncate(s: string, max = 155) {
  if (!s) return "";
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…";
}

export const Route = createFileRoute("/producto/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.product;
    if (!p) {
      return {
        meta: [
          { title: `Producto | Space Phone` },
          { property: "og:url", content: `/producto/${params.slug}` },
        ],
        links: [{ rel: "canonical", href: `/producto/${params.slug}` }],
      };
    }
    const title = `${p.title} | Space Phone`;
    const description = truncate(
      p.description?.trim() ||
        `${p.title} — ${p.subcategoryTitle} en ${p.categoryTitle}. ${formatPrice(p.priceUSD)}. Cómpralo en Space Phone con garantía.`,
    );
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/producto/${p.slug}` },
        { property: "og:type", content: "product" },
        { property: "og:image", content: p.imageUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.imageUrl },
      ],
      links: [{ rel: "canonical", href: `/producto/${p.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: p.description ?? description,
            image: p.imageUrl,
            sku: p.slug,
            category: `${p.categoryTitle} > ${p.subcategoryTitle}`,
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: p.priceUSD.toFixed(2),
              availability:
                p.stock !== null && p.stock !== undefined && p.stock <= 0
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
              url: `/producto/${p.slug}`,
            },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="min-h-screen pt-32 px-4 text-on-surface-variant text-center">
      <h1 className="text-2xl font-bold text-on-surface mb-2">Producto no encontrado</h1>
      <Link to="/catalogo" className="text-primary-bright hover:underline">Volver al catálogo</Link>
    </main>
  ),
  errorComponent: () => (
    <main className="min-h-screen pt-32 px-4 text-on-surface-variant text-center">
      <h1 className="text-2xl font-bold text-on-surface mb-2">No pudimos cargar este producto</h1>
      <Link to="/catalogo" className="text-primary-bright hover:underline">Volver al catálogo</Link>
    </main>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [imgError, setImgError] = useState(false);
  const { add } = useCart();

  const message = encodeURIComponent(`Hola, me interesa: ${product.title} (${formatPrice(product.priceUSD)})`);

  return (
    <main className="min-h-screen pb-24">
      <Breadcrumbs
        trail={[
          { label: "Inicio", to: "/" },
          { label: "Catálogo", to: "/catalogo" },
          { label: product.categoryTitle, to: "/catalogo/$categoria", params: { categoria: product.categorySlug } },
          { label: product.subcategoryTitle, to: "/catalogo/$categoria/$subcategoria", params: { categoria: product.categorySlug, subcategoria: product.subcategorySlug } },
          { label: product.title },
        ]}
      />
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-surface-container overflow-hidden aspect-square">
          <img
            src={imgError ? PLACEHOLDER_IMG : product.imageUrl}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          {product.badge && (
            <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container">
              {product.badge}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-3">{product.title}</h1>
          <p className="text-3xl font-bold text-primary-bright mb-6">{formatPrice(product.priceUSD)}</p>
          {product.description && <p className="text-on-surface-variant mb-6">{product.description}</p>}

          {product.specs && product.specs.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8 text-sm">
              {product.specs.map((s: { label: string; value: string }, i: number) => (
                <div key={i} className="contents">
                  <dt className="text-on-surface-variant">{s.label}</dt>
                  <dd className="text-on-surface font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => add(product)}
              className="px-6 py-3 rounded-full btn-primary text-white font-semibold inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add_shopping_cart</span>
              Agregar al carrito
            </button>
            <a
              href={`${SOCIAL_LINKS.whatsapp}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">chat</span>
              Consultar por WhatsApp
            </a>
          </div>

          <Link to="/carrito" className="mt-6 inline-block text-sm text-primary-bright hover:underline">
            Ver carrito →
          </Link>
        </div>
      </section>
    </main>
  );
}
