import { z } from "zod";
import catalogJson from "@/data/catalog.json";

// ───────────── Tipos validados ─────────────

const RawSubcategorySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  icon: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  order: z.number().nullable().optional(),
});

const RawCategorySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  icon: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  order: z.number().nullable().optional(),
  subcategories: z.array(RawSubcategorySchema).default([]),
});

const RawProductSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  categorySlug: z.string().min(1),
  subcategorySlug: z.string().min(1),
  priceUSD: z.number().min(0),
  imageUrl: z
    .string()
    .min(1)
    .refine(
      (u) => /^https?:\/\//i.test(u) || u.startsWith("/"),
      "Debe ser URL completa (https://…) o ruta absoluta del sitio (/…)",
    ),
  badge: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  specs: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .nullable()
    .optional(),
  stock: z.number().int().min(0).nullable().optional(),
  featured: z.boolean().nullable().optional(),
});

const RawCatalogSchema = z.object({
  categories: z.array(RawCategorySchema).default([]),
  products: z.array(RawProductSchema).default([]),
});

// Tipos públicos (mismas formas que antes, para no tocar rutas/componentes)
export type Subcategory = {
  _id: string;
  slug: string;
  title: string;
  icon?: string | null;
  description?: string | null;
  order?: number | null;
  categorySlug: string;
  categoryTitle: string;
  productCount: number;
};

export type Category = {
  _id: string;
  slug: string;
  title: string;
  icon?: string | null;
  description?: string | null;
  order?: number | null;
  subcategories: Subcategory[];
};

export type Product = {
  _id: string;
  slug: string;
  title: string;
  priceUSD: number;
  imageUrl: string;
  badge?: string | null;
  description?: string | null;
  specs?: { label: string; value: string }[] | null;
  stock?: number | null;
  featured?: boolean | null;
  subcategorySlug: string;
  subcategoryTitle: string;
  categorySlug: string;
  categoryTitle: string;
};

// ───────────── Parseo (con fallback seguro) ─────────────

function parseCatalog() {
  const r = RawCatalogSchema.safeParse(catalogJson);
  if (!r.success) {
    console.error("[catalog] JSON inválido:", r.error.flatten());
    return { categories: [], products: [] };
  }
  return r.data;
}

const RAW = parseCatalog();

function sortByOrder<T extends { order?: number | null; title: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => {
    const ao = a.order ?? 9999;
    const bo = b.order ?? 9999;
    if (ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title);
  });
}

const CATEGORIES: Category[] = sortByOrder(RAW.categories).map((c) => {
  const subs: Subcategory[] = sortByOrder(c.subcategories).map((s) => ({
    _id: `${c.slug}/${s.slug}`,
    slug: s.slug,
    title: s.title,
    icon: s.icon,
    description: s.description,
    order: s.order,
    categorySlug: c.slug,
    categoryTitle: c.title,
    productCount: RAW.products.filter(
      (p) => p.categorySlug === c.slug && p.subcategorySlug === s.slug,
    ).length,
  }));
  return {
    _id: c.slug,
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    description: c.description,
    order: c.order,
    subcategories: subs,
  };
});

const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

const PRODUCTS: Product[] = RAW.products
  .map((p): Product | null => {
    const cat = CATEGORY_BY_SLUG.get(p.categorySlug);
    if (!cat) {
      console.warn(
        `[catalog] producto "${p.slug}" apunta a category inexistente "${p.categorySlug}"`,
      );
      return null;
    }
    const sub = cat.subcategories.find((s) => s.slug === p.subcategorySlug);
    if (!sub) {
      console.warn(
        `[catalog] producto "${p.slug}" apunta a subcategory inexistente "${p.subcategorySlug}"`,
      );
      return null;
    }
    return {
      _id: p.slug,
      slug: p.slug,
      title: p.title,
      priceUSD: p.priceUSD,
      imageUrl: p.imageUrl,
      badge: p.badge,
      description: p.description,
      specs: p.specs,
      stock: p.stock,
      featured: p.featured,
      subcategorySlug: sub.slug,
      subcategoryTitle: sub.title,
      categorySlug: cat.slug,
      categoryTitle: cat.title,
    };
  })
  .filter((p): p is Product => p !== null);

// ───────────── API pública (async para compatibilidad) ─────────────

export async function fetchNavigation(): Promise<Category[]> {
  return CATEGORIES;
}

export async function fetchCategory(slug: string): Promise<Category | null> {
  return CATEGORY_BY_SLUG.get(slug) ?? null;
}

export async function fetchSubcategory(
  categorySlug: string,
  subSlug: string,
): Promise<{ sub: Subcategory; products: Product[] } | null> {
  const cat = CATEGORY_BY_SLUG.get(categorySlug);
  if (!cat) return null;
  const sub = cat.subcategories.find((s) => s.slug === subSlug);
  if (!sub) return null;
  const products = PRODUCTS.filter(
    (p) => p.categorySlug === categorySlug && p.subcategorySlug === subSlug,
  );
  return { sub, products };
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function fetchAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function fetchFeatured(limit = 8): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export async function fetchAllProductsForSitemap(): Promise<{ slug: string; updatedAt: string }[]> {
  const now = new Date().toISOString();
  return PRODUCTS.map((p) => ({ slug: p.slug, updatedAt: now }));
}

// Formato consistente de precio
export function formatPrice(usd: number): string {
  return (
    "$" +
    usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    " USD"
  );
}
