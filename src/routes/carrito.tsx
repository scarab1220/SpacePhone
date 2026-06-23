import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs, PageHero } from "@/components/PageLayout";
import { useCart } from "@/lib/cart";
import { SOCIAL_LINKS, PLACEHOLDER_IMG } from "@/data/catalog";
import { formatPrice } from "@/lib/catalog.queries";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Carrito | Space Phone" },
      { name: "description", content: "Revisa los productos que agregaste y finaliza tu compra." },
      { property: "og:title", content: "Carrito | Space Phone" },
      {
        property: "og:description",
        content: "Revisa los productos que agregaste y finaliza tu compra.",
      },
      { property: "og:url", content: "/carrito" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/carrito" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, totalText, setQty, remove, clear, count } = useCart();

  const message = encodeURIComponent(
    `Hola, quiero comprar:\n${items.map((i) => `- ${i.product.title} x${i.qty} (${formatPrice(i.product.priceUSD)})`).join("\n")}\nTotal: ${totalText}`,
  );

  return (
    <main className="min-h-screen pb-24">
      <Breadcrumbs trail={[{ label: "Inicio", to: "/" }, { label: "Carrito" }]} />
      <PageHero
        eyebrow="Tu pedido"
        title="Carrito"
        description={
          count === 0
            ? "Tu carrito está vacío."
            : `${count} producto${count === 1 ? "" : "s"} listo${count === 1 ? "" : "s"} para confirmar.`
        }
        icon="shopping_cart"
      />

      <section className="max-w-5xl mx-auto px-4 md:px-8">
        {items.length === 0 ? (
          <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-primary-bright mb-3 block">
              shopping_bag
            </span>
            <p className="text-on-surface-variant mb-6">Aún no agregaste ningún producto.</p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary text-white font-semibold"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <ul className="space-y-3">
              {items.map((i) => (
                <li
                  key={i.product._id}
                  className="rounded-2xl bg-surface-container border border-outline-variant/20 p-4 flex gap-4 items-center"
                >
                  <Link to="/producto/$slug" params={{ slug: i.product.slug }} className="shrink-0">
                    <img
                      src={i.product.imageUrl || PLACEHOLDER_IMG}
                      alt={i.product.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/producto/$slug"
                      params={{ slug: i.product.slug }}
                      className="block font-semibold text-on-surface hover:text-primary-bright truncate"
                    >
                      {i.product.title}
                    </Link>
                    <p className="text-sm text-primary-bright font-bold">
                      {formatPrice(i.product.priceUSD)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-full p-1">
                    <button
                      onClick={() => setQty(i.product._id, i.qty - 1)}
                      className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface"
                      aria-label="Disminuir"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-on-surface">
                      {i.qty}
                    </span>
                    <button
                      onClick={() => setQty(i.product._id, i.qty + 1)}
                      className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface"
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => remove(i.product._id)}
                    className="text-on-surface-variant hover:text-destructive p-2"
                    aria-label="Eliminar"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </li>
              ))}
              <button
                onClick={clear}
                className="text-sm text-on-surface-variant hover:text-destructive inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">delete_sweep</span> Vaciar
                carrito
              </button>
            </ul>

            <aside className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 h-fit sticky top-24">
              <h2 className="text-lg font-semibold text-on-surface mb-4">Resumen</h2>
              <div className="flex justify-between text-on-surface-variant mb-2">
                <span>Productos</span>
                <span>{count}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-on-surface border-t border-outline-variant/20 pt-3 mt-3">
                <span>Total</span>
                <span className="text-primary-bright">{totalText}</span>
              </div>
              <a
                href={`${SOCIAL_LINKS.whatsapp}?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full btn-primary text-white font-semibold"
              >
                <span className="material-symbols-outlined">chat</span>
                Confirmar por WhatsApp
              </a>
              <Link
                to="/metodos-de-pago"
                className="mt-3 block text-center text-sm text-primary-bright hover:underline"
              >
                Ver métodos de pago
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
