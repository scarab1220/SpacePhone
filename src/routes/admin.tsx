import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  fetchAllProducts,
  fetchNavigation,
  type Category,
  type Product,
} from "@/lib/catalog.queries";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Generador de catálogo · Space Phone" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminGate,
});

function AdminGate() {
  // Internal catalog-building tool: only available in local development builds.
  // In production (preview/published), render a generic not-found page so the
  // route is not a public surface and does not leak internal schema details.
  if (import.meta.env.PROD) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Página no encontrada</h1>
          <p className="text-muted-foreground">La ruta solicitada no existe.</p>
        </div>
      </div>
    );
  }
  return <AdminBuilder />;
}

type Mode = "product" | "subcategory" | "category";

// ─────────────────────────────────────────────
// Esquemas Zod compartidos
// ─────────────────────────────────────────────

const slugRule = z
  .string()
  .min(1, "Requerido")
  .max(80, "Máximo 80 caracteres")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Solo minúsculas, números y guiones (sin espacios, sin tildes, sin guion al inicio/fin)",
  );

const titleRule = z.string().trim().min(1, "Requerido").max(120, "Máximo 120 caracteres");

const imageUrlRule = z
  .string()
  .trim()
  .min(1, "Requerido")
  .max(2000, "URL demasiado larga")
  .refine(
    (u) => /^https?:\/\//i.test(u) || u.startsWith("/"),
    "Debe ser URL completa (https://…) o ruta absoluta del sitio (/…)",
  );

const priceRule = z
  .number({ message: "Debe ser un número" })
  .positive("Debe ser mayor a 0")
  .max(1_000_000, "Precio fuera de rango")
  .refine((n) => Number.isFinite(n), "Precio inválido");

const iconRule = z
  .string()
  .max(40, "Máximo 40 caracteres")
  .regex(/^[a-z0-9_]*$/, "Solo minúsculas, números y guion bajo")
  .optional()
  .or(z.literal(""));

const descRule = z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal(""));

const specsRule = z
  .array(
    z.object({
      label: z.string().trim().min(1, "Etiqueta requerida").max(60, "Máx 60"),
      value: z.string().trim().min(1, "Valor requerido").max(120, "Máx 120"),
    }),
  )
  .max(20, "Máximo 20 especificaciones");

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

function AdminBuilder() {
  const [mode, setMode] = useState<Mode>("product");
  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchNavigation().then(setCats);
    fetchAllProducts().then(setProducts);
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <header className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-bright">
            Herramienta interna
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface mt-2 mb-3">
            Generador de catálogo
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Llena el formulario. El generador valida con Zod (slugs únicos, precios, URLs, etc.)
            antes de dejarte copiar el JSON. Pégalo en{" "}
            <code className="px-1.5 py-0.5 rounded bg-surface-container text-primary-bright">
              src/data/catalog.json
            </code>
            .
          </p>
        </header>

        <div className="flex gap-2 mb-8 border-b border-outline-variant/20">
          {(["product", "subcategory", "category"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 transition-colors ${
                mode === m
                  ? "border-primary text-primary-bright"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {m === "product" ? "Producto" : m === "subcategory" ? "Subcategoría" : "Categoría"}
            </button>
          ))}
        </div>

        {mode === "product" && <ProductForm cats={cats} products={products} />}
        {mode === "subcategory" && <SubcategoryForm cats={cats} />}
        {mode === "category" && <CategoryForm cats={cats} />}

        <ImageHostsTip />
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-on-surface mb-1">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs text-destructive mt-1 inline-flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </span>
      ) : (
        hint && <span className="block text-xs text-on-surface-variant mt-1">{hint}</span>
      )}
    </label>
  );
}

const baseInputCls =
  "w-full px-3 py-2 rounded-lg bg-surface-container border text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none";
const inputCls = (err?: string) =>
  `${baseInputCls} ${
    err
      ? "border-destructive focus:border-destructive"
      : "border-outline-variant/30 focus:border-primary"
  }`;

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ImagePreview({ url }: { url: string }) {
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(true), [url]);
  if (!url) {
    return (
      <div className="aspect-square w-full max-w-[200px] rounded-xl bg-surface-container border border-dashed border-outline-variant/40 flex items-center justify-center text-on-surface-variant text-sm">
        <div className="text-center">
          <span className="material-symbols-outlined text-3xl block mb-1">image</span>
          Pega una URL
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-square w-full max-w-[200px] rounded-xl bg-surface-container border border-outline-variant/30 overflow-hidden">
      {ok ? (
        <img
          src={url}
          alt="vista previa"
          className="w-full h-full object-cover"
          onError={() => setOk(false)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-destructive text-sm p-3 text-center">
          <div>
            <span className="material-symbols-outlined block mb-1">broken_image</span>
            No se pudo cargar la imagen
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationSummary({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="mt-4 rounded-2xl bg-destructive/10 border border-destructive/30 p-4">
      <p className="font-semibold text-destructive mb-2 inline-flex items-center gap-2">
        <span className="material-symbols-outlined">error</span>
        Corrige antes de copiar ({errors.length})
      </p>
      <ul className="text-sm text-destructive space-y-1 list-disc list-inside">
        {errors.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

function CopyBlock({
  json,
  instructions,
  disabled,
}: {
  json: string;
  instructions: string;
  disabled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (disabled) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className={`mt-6 rounded-2xl border overflow-hidden ${
        disabled
          ? "bg-surface-container/50 border-outline-variant/20 opacity-60"
          : "bg-surface-container border-outline-variant/20"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20 bg-surface-container-high">
        <p className="text-sm text-on-surface-variant">{instructions}</p>
        <button
          type="button"
          onClick={copy}
          disabled={disabled}
          className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-sm font-semibold inline-flex items-center gap-1.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">
            {copied ? "check" : "content_copy"}
          </span>
          {copied ? "Copiado" : disabled ? "Bloqueado" : "Copiar JSON"}
        </button>
      </div>
      <pre className="p-4 text-xs text-on-surface overflow-auto font-mono whitespace-pre">
        {json}
      </pre>
    </div>
  );
}

// Lee errores por campo desde un flatten() de Zod
function fieldError(
  fieldErrors: Record<string, string[] | undefined>,
  key: string,
): string | undefined {
  return fieldErrors[key]?.[0];
}

// ─────────────────────────────────────────────
// Producto
// ─────────────────────────────────────────────

function ProductForm({ cats, products }: { cats: Category[]; products: Product[] }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);

  const effectiveSlug = slugTouched ? slug : toSlug(title);
  const subOptions = cats.find((c) => c.slug === categorySlug)?.subcategories ?? [];

  const existingProductSlugs = useMemo(() => new Set(products.map((p) => p.slug)), [products]);
  const categorySlugs = useMemo(() => new Set(cats.map((c) => c.slug)), [cats]);

  const productSchema = useMemo(
    () =>
      z.object({
        title: titleRule,
        slug: slugRule.refine(
          (s) => !existingProductSlugs.has(s),
          "Ya existe un producto con este slug",
        ),
        categorySlug: z
          .string()
          .min(1, "Selecciona una categoría")
          .refine((s) => categorySlugs.has(s), "Categoría no encontrada"),
        subcategorySlug: z.string().min(1, "Selecciona una subcategoría"),
        priceUSD: priceRule,
        imageUrl: imageUrlRule,
        badge: z.string().max(30, "Máximo 30 caracteres").optional().or(z.literal("")),
        description: descRule,
        stock: z
          .number({ message: "Debe ser un número" })
          .int("Debe ser entero")
          .min(0, "No puede ser negativo")
          .max(1_000_000, "Fuera de rango")
          .optional(),
        featured: z.boolean(),
        specs: specsRule,
      }),
    [existingProductSlugs, categorySlugs],
  );

  const candidate = {
    title: title.trim(),
    slug: effectiveSlug,
    categorySlug,
    subcategorySlug,
    priceUSD: priceUSD === "" ? NaN : Number(priceUSD),
    imageUrl: imageUrl.trim(),
    badge: badge.trim(),
    description: description.trim(),
    stock: stock === "" ? undefined : Number(stock),
    featured,
    specs,
  };

  const parsed = productSchema.safeParse(candidate);
  const flat = parsed.success ? null : parsed.error.flatten();
  const fieldErrors = flat?.fieldErrors ?? {};

  // Validación cruzada: subcategoría debe existir dentro de la categoría
  const crossErrors: string[] = [];
  if (categorySlug && subcategorySlug) {
    const ok = subOptions.some((s) => s.slug === subcategorySlug);
    if (!ok) crossErrors.push("La subcategoría no pertenece a la categoría seleccionada.");
  }

  const allErrors = [
    ...(flat ? flat.formErrors : []),
    ...Object.entries(fieldErrors).flatMap(([k, v]) => (v ?? []).map((m) => `${k}: ${m}`)),
    ...crossErrors,
  ];

  const json = useMemo(() => {
    const obj: Record<string, unknown> = {
      slug: effectiveSlug,
      title: title.trim(),
      categorySlug,
      subcategorySlug,
      priceUSD: Number(priceUSD) || 0,
      imageUrl: imageUrl.trim(),
    };
    if (badge.trim()) obj.badge = badge.trim();
    if (description.trim()) obj.description = description.trim();
    const cleanSpecs = specs.filter((s) => s.label.trim() && s.value.trim());
    if (cleanSpecs.length) obj.specs = cleanSpecs;
    if (stock !== "") obj.stock = Number(stock);
    if (featured) obj.featured = true;
    return JSON.stringify(obj, null, 2);
  }, [
    effectiveSlug,
    title,
    categorySlug,
    subcategorySlug,
    priceUSD,
    imageUrl,
    badge,
    description,
    specs,
    stock,
    featured,
  ]);

  const valid = parsed.success && crossErrors.length === 0;

  return (
    <section className="grid md:grid-cols-[1fr_240px] gap-6 items-start">
      <div className="space-y-4">
        <Field label="Nombre del producto" hint="Ej: iPhone 15 Pro 128GB" error={fieldError(fieldErrors, "title")}>
          <input
            className={inputCls(fieldError(fieldErrors, "title"))}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="iPhone 15 Pro 128GB"
            maxLength={120}
          />
        </Field>

        <Field
          label="Slug (URL)"
          hint="Se rellena solo. Debe ser único."
          error={fieldError(fieldErrors, "slug")}
        >
          <input
            className={inputCls(fieldError(fieldErrors, "slug"))}
            value={effectiveSlug}
            onChange={(e) => {
              setSlug(toSlug(e.target.value));
              setSlugTouched(true);
            }}
            placeholder="iphone-15-pro-128"
            maxLength={80}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoría" error={fieldError(fieldErrors, "categorySlug")}>
            <select
              className={inputCls(fieldError(fieldErrors, "categorySlug"))}
              value={categorySlug}
              onChange={(e) => {
                setCategorySlug(e.target.value);
                setSubcategorySlug("");
              }}
            >
              <option value="">Selecciona…</option>
              {cats.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subcategoría" error={fieldError(fieldErrors, "subcategorySlug")}>
            <select
              className={inputCls(fieldError(fieldErrors, "subcategorySlug"))}
              value={subcategorySlug}
              onChange={(e) => setSubcategorySlug(e.target.value)}
              disabled={!categorySlug}
            >
              <option value="">Selecciona…</option>
              {subOptions.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Precio (USD)"
            hint="Solo números. Ej: 999.00"
            error={fieldError(fieldErrors, "priceUSD")}
          >
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputCls(fieldError(fieldErrors, "priceUSD"))}
              value={priceUSD}
              onChange={(e) => setPriceUSD(e.target.value)}
              placeholder="999.00"
            />
          </Field>
          <Field label="Stock (opcional)" error={fieldError(fieldErrors, "stock")}>
            <input
              type="number"
              min="0"
              className={inputCls(fieldError(fieldErrors, "stock"))}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="URL de imagen"
          hint="Pega una URL pública (https://…)"
          error={fieldError(fieldErrors, "imageUrl")}
        >
          <input
            className={inputCls(fieldError(fieldErrors, "imageUrl"))}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value.trim())}
            placeholder="https://images.unsplash.com/..."
          />
        </Field>

        <Field
          label="Badge (opcional)"
          hint='Ej: "Nuevo", "Oferta", "Seminuevo"'
          error={fieldError(fieldErrors, "badge")}
        >
          <input
            className={inputCls(fieldError(fieldErrors, "badge"))}
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="Nuevo"
            maxLength={30}
          />
        </Field>

        <Field label="Descripción (opcional)" error={fieldError(fieldErrors, "description")}>
          <textarea
            className={inputCls(fieldError(fieldErrors, "description")) + " min-h-[80px]"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
        </Field>

        <SpecsEditor specs={specs} onChange={setSpecs} errors={fieldErrors.specs} />

        <label className="inline-flex items-center gap-2 text-sm text-on-surface">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          Mostrar como destacado en la página de inicio
        </label>
      </div>

      <div className="md:sticky md:top-24">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          Vista previa
        </p>
        <ImagePreview url={imageUrl} />
      </div>

      <div className="md:col-span-2">
        <ValidationSummary errors={allErrors} />
        <CopyBlock
          json={json}
          disabled={!valid}
          instructions={
            valid
              ? `Copia y pégalo dentro del array "products" en src/data/catalog.json.`
              : "Corrige los errores indicados para habilitar la copia."
          }
        />
      </div>
    </section>
  );
}

function SpecsEditor({
  specs,
  onChange,
  errors,
}: {
  specs: { label: string; value: string }[];
  onChange: (s: { label: string; value: string }[]) => void;
  errors?: string[];
}) {
  return (
    <div>
      <p className="text-sm font-medium text-on-surface mb-2">Especificaciones (opcional)</p>
      <div className="space-y-2">
        {specs.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input
              className={inputCls()}
              placeholder="Etiqueta (ej. Pantalla)"
              value={s.label}
              maxLength={60}
              onChange={(e) => {
                const next = [...specs];
                next[i] = { ...next[i], label: e.target.value };
                onChange(next);
              }}
            />
            <input
              className={inputCls()}
              placeholder='Valor (ej. 6.1" OLED)'
              value={s.value}
              maxLength={120}
              onChange={(e) => {
                const next = [...specs];
                next[i] = { ...next[i], value: e.target.value };
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(specs.filter((_, j) => j !== i))}
              className="w-10 h-10 rounded-lg bg-surface-container hover:bg-destructive/10 hover:text-destructive text-on-surface-variant flex items-center justify-center"
              aria-label="Quitar"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        ))}
      </div>
      {errors && errors.length > 0 && (
        <p className="text-xs text-destructive mt-1">{errors[0]}</p>
      )}
      <button
        type="button"
        onClick={() => onChange([...specs, { label: "", value: "" }])}
        className="mt-2 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-sm text-on-surface inline-flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-base">add</span>
        Agregar especificación
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Subcategoría
// ─────────────────────────────────────────────

function SubcategoryForm({ cats }: { cats: Category[] }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categorySlug, setCategorySlug] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  const effectiveSlug = slugTouched ? slug : toSlug(title);
  const categorySlugs = useMemo(() => new Set(cats.map((c) => c.slug)), [cats]);
  const siblingSlugs = useMemo(
    () =>
      new Set(
        cats
          .find((c) => c.slug === categorySlug)
          ?.subcategories.map((s) => s.slug) ?? [],
      ),
    [cats, categorySlug],
  );

  const schema = useMemo(
    () =>
      z.object({
        categorySlug: z
          .string()
          .min(1, "Selecciona la categoría destino")
          .refine((s) => categorySlugs.has(s), "Categoría no encontrada"),
        title: titleRule,
        slug: slugRule.refine(
          (s) => !siblingSlugs.has(s),
          "Ya existe una subcategoría con ese slug en esta categoría",
        ),
        icon: iconRule,
        description: descRule,
        order: z
          .number({ message: "Debe ser número" })
          .int("Debe ser entero")
          .min(0, "≥ 0")
          .max(9999, "Fuera de rango")
          .optional(),
      }),
    [categorySlugs, siblingSlugs],
  );

  const parsed = schema.safeParse({
    categorySlug,
    title: title.trim(),
    slug: effectiveSlug,
    icon: icon.trim(),
    description: description.trim(),
    order: order === "" ? undefined : Number(order),
  });
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const formErrors = parsed.success ? [] : parsed.error.flatten().formErrors;
  const allErrors = [
    ...formErrors,
    ...Object.entries(fieldErrors).flatMap(([k, v]) => (v ?? []).map((m) => `${k}: ${m}`)),
  ];

  const json = useMemo(() => {
    const obj: Record<string, unknown> = { slug: effectiveSlug, title: title.trim() };
    if (icon.trim()) obj.icon = icon.trim();
    if (description.trim()) obj.description = description.trim();
    if (order !== "") obj.order = Number(order);
    return JSON.stringify(obj, null, 2);
  }, [effectiveSlug, title, icon, description, order]);

  return (
    <section className="space-y-4">
      <Field label="Categoría destino" error={fieldError(fieldErrors, "categorySlug")}>
        <select
          className={inputCls(fieldError(fieldErrors, "categorySlug"))}
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
        >
          <option value="">Selecciona…</option>
          {cats.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Nombre" error={fieldError(fieldErrors, "title")}>
        <input
          className={inputCls(fieldError(fieldErrors, "title"))}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Power Banks"
          maxLength={120}
        />
      </Field>
      <Field label="Slug (URL)" error={fieldError(fieldErrors, "slug")}>
        <input
          className={inputCls(fieldError(fieldErrors, "slug"))}
          value={effectiveSlug}
          onChange={(e) => {
            setSlug(toSlug(e.target.value));
            setSlugTouched(true);
          }}
          maxLength={80}
        />
      </Field>
      <Field
        label="Ícono (opcional)"
        hint="Nombre Material Symbols. Ej: bolt, headphones"
        error={fieldError(fieldErrors, "icon")}
      >
        <input
          className={inputCls(fieldError(fieldErrors, "icon"))}
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="bolt"
          maxLength={40}
        />
      </Field>
      <Field label="Descripción (opcional)" error={fieldError(fieldErrors, "description")}>
        <textarea
          className={inputCls(fieldError(fieldErrors, "description")) + " min-h-[80px]"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
      </Field>
      <Field
        label="Orden (opcional, menor = primero)"
        error={fieldError(fieldErrors, "order")}
      >
        <input
          type="number"
          className={inputCls(fieldError(fieldErrors, "order"))}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </Field>

      <ValidationSummary errors={allErrors} />
      <CopyBlock
        json={json}
        disabled={!parsed.success}
        instructions={
          parsed.success
            ? `Pega este bloque dentro del array "subcategories" de la categoría "${categorySlug}" en src/data/catalog.json.`
            : "Corrige los errores indicados para habilitar la copia."
        }
      />
    </section>
  );
}

// ─────────────────────────────────────────────
// Categoría
// ─────────────────────────────────────────────

function CategoryForm({ cats }: { cats: Category[] }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  const effectiveSlug = slugTouched ? slug : toSlug(title);
  const existingSlugs = useMemo(() => new Set(cats.map((c) => c.slug)), [cats]);

  const schema = useMemo(
    () =>
      z.object({
        title: titleRule,
        slug: slugRule.refine(
          (s) => !existingSlugs.has(s),
          "Ya existe una categoría con ese slug",
        ),
        icon: iconRule,
        description: descRule,
        order: z
          .number({ message: "Debe ser número" })
          .int("Debe ser entero")
          .min(0, "≥ 0")
          .max(9999, "Fuera de rango")
          .optional(),
      }),
    [existingSlugs],
  );

  const parsed = schema.safeParse({
    title: title.trim(),
    slug: effectiveSlug,
    icon: icon.trim(),
    description: description.trim(),
    order: order === "" ? undefined : Number(order),
  });
  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const formErrors = parsed.success ? [] : parsed.error.flatten().formErrors;
  const allErrors = [
    ...formErrors,
    ...Object.entries(fieldErrors).flatMap(([k, v]) => (v ?? []).map((m) => `${k}: ${m}`)),
  ];

  const json = useMemo(() => {
    const obj: Record<string, unknown> = { slug: effectiveSlug, title: title.trim() };
    if (icon.trim()) obj.icon = icon.trim();
    if (description.trim()) obj.description = description.trim();
    if (order !== "") obj.order = Number(order);
    obj.subcategories = [];
    return JSON.stringify(obj, null, 2);
  }, [effectiveSlug, title, icon, description, order]);

  return (
    <section className="space-y-4">
      <Field label="Nombre" error={fieldError(fieldErrors, "title")}>
        <input
          className={inputCls(fieldError(fieldErrors, "title"))}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tablets"
          maxLength={120}
        />
      </Field>
      <Field label="Slug (URL)" error={fieldError(fieldErrors, "slug")}>
        <input
          className={inputCls(fieldError(fieldErrors, "slug"))}
          value={effectiveSlug}
          onChange={(e) => {
            setSlug(toSlug(e.target.value));
            setSlugTouched(true);
          }}
          maxLength={80}
        />
      </Field>
      <Field
        label="Ícono (opcional)"
        hint="Nombre Material Symbols. Ej: tablet, watch"
        error={fieldError(fieldErrors, "icon")}
      >
        <input
          className={inputCls(fieldError(fieldErrors, "icon"))}
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="tablet"
          maxLength={40}
        />
      </Field>
      <Field label="Descripción (opcional)" error={fieldError(fieldErrors, "description")}>
        <textarea
          className={inputCls(fieldError(fieldErrors, "description")) + " min-h-[80px]"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
      </Field>
      <Field label="Orden (opcional)" error={fieldError(fieldErrors, "order")}>
        <input
          type="number"
          className={inputCls(fieldError(fieldErrors, "order"))}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </Field>

      <ValidationSummary errors={allErrors} />
      <CopyBlock
        json={json}
        disabled={!parsed.success}
        instructions={
          parsed.success
            ? `Pega este bloque dentro del array "categories" en src/data/catalog.json.`
            : "Corrige los errores indicados para habilitar la copia."
        }
      />
    </section>
  );
}

// ─────────────────────────────────────────────
// Tip de hosts gratis
// ─────────────────────────────────────────────

function ImageHostsTip() {
  const hosts = [
    {
      name: "Unsplash",
      desc: "Banco de fotos gratis. Busca, abre la foto, copia la URL directa.",
      url: "https://unsplash.com",
      icon: "photo_library",
    },
    {
      name: "Postimages",
      desc: "Sube tu propia foto sin cuenta. Usa el link 'Direct link'.",
      url: "https://postimages.org",
      icon: "cloud_upload",
    },
    {
      name: "Imgur",
      desc: "Sube y obtén URL directa (asegúrate que termine en .jpg o .png).",
      url: "https://imgur.com/upload",
      icon: "image",
    },
  ];
  return (
    <section className="mt-12 rounded-2xl bg-surface-container border border-outline-variant/20 p-6">
      <h2 className="text-lg font-semibold text-on-surface mb-1 inline-flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-bright">tips_and_updates</span>
        ¿De dónde saco URLs de imágenes gratis?
      </h2>
      <p className="text-sm text-on-surface-variant mb-4">
        La URL debe ser pública y terminar idealmente en <code>.jpg</code>, <code>.png</code> o{" "}
        <code>.webp</code>.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {hosts.map((h) => (
          <a
            key={h.name}
            href={h.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl bg-surface-container-high hover:border-primary/50 border border-transparent p-4 transition-all"
          >
            <span className="material-symbols-outlined text-primary-bright mb-2 block">{h.icon}</span>
            <p className="font-semibold text-on-surface text-sm">{h.name}</p>
            <p className="text-xs text-on-surface-variant mt-1">{h.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
