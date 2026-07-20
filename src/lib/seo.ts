export const NOINDEX_PATHS = new Set(["/admin", "/carrito"]);

export const STATIC_SITEMAP_PATHS = [
  "/",
  "/catalogo",
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
] as const;

export function isIndexablePath(path: string): boolean {
  return !NOINDEX_PATHS.has(path);
}

export function toAbsoluteUrl(path: string, origin: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, origin).toString();
}
