import { createFileRoute } from "@tanstack/react-router";
import { fetchAllProductsForSitemap, fetchNavigation } from "@/lib/catalog.queries";

const STATIC_PATHS = [
  "/",
  "/catalogo",
  "/carrito",
  "/contacto",
  "/sobre-nosotros",
  "/sucursales",
  "/sucursales/metrocentro",
  "/sucursales/metrosur",
  "/sucursales/plaza-mundo",
  "/faq",
  "/envios",
  "/garantia",
  "/terminos",
  "/metodos-de-pago",
  "/metodos-de-pago/efectivo",
  "/metodos-de-pago/tarjetas",
  "/metodos-de-pago/transferencia",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const [nav, products] = await Promise.all([
          fetchNavigation().catch(() => []),
          fetchAllProductsForSitemap().catch(() => []),
        ]);

        const urls: { loc: string; lastmod?: string }[] = [];
        for (const p of STATIC_PATHS) urls.push({ loc: `${origin}${p}` });
        for (const cat of nav) {
          urls.push({ loc: `${origin}/catalogo/${cat.slug}` });
          for (const sub of cat.subcategories) {
            urls.push({ loc: `${origin}/catalogo/${cat.slug}/${sub.slug}` });
          }
        }
        for (const p of products) {
          urls.push({ loc: `${origin}/producto/${p.slug}`, lastmod: p.updatedAt });
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map(
            (u) =>
              `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
          )
          .join("\n")}\n</urlset>`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
