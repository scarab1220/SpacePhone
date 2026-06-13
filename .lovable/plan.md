## Objetivo

El cliente administra todo el catálogo (categorías, subcategorías, productos, precios, imágenes por URL) desde **Sanity Studio**, sin tocar código. El sitio lee de Sanity en runtime y el checkout cobra con **Stripe Checkout**. Agregar productos o categorías nuevas no requiere ningún deploy ni puede romper la build.

---

## Arquitectura

```text
Cliente edita en Sanity Studio
            │
            ▼
   Sanity (CMS hospedado)
            │  consulta GROQ
            ▼
TanStack Start (este sitio)
  ├─ Rutas dinámicas /catalogo/$cat/$sub
  ├─ Carrito local (igual que hoy)
  └─ /checkout → serverFn crea Stripe Session → Stripe Checkout
                                                       │
                                                       ▼
                                          /api/public/stripe-webhook
                                                       │
                                                       ▼
                                                Orden guardada
```

---

## Modelo de contenido en Sanity

Tres schemas que el cliente verá como pestañas en Sanity Studio:

1. **Categoría** — `title`, `slug`, `icon`, `description`, `order`.
2. **Subcategoría** — `title`, `slug`, `parentCategory` (referencia), `icon`, `description`, `order`.
3. **Producto** — `title`, `slug`, `subcategory` (referencia), `priceUSD` (número), `imageUrl` (URL), `badge?`, `description`, `specs[]`, `active` (boolean), `featured` (boolean), `stock?`.

El cliente solo crea/edita/desactiva documentos. Toda la navegación del sitio se genera desde ahí.

---

## Cambios en el sitio

### Datos
- Reemplazar `src/data/catalog.ts` por `src/lib/sanity.ts` (cliente) + `src/lib/catalog.queries.ts` (GROQ).
- Queries envueltas en `createServerFn` para que las llaves de Sanity vivan en el server y el SSR cachee resultados.
- Validación con Zod al recibir datos: si un producto trae datos inválidos, se omite del listado en lugar de romper la página.

### Rutas dinámicas (clave para "no romper nada")
Reemplazar los 22 archivos de ruta hardcodeados por 3 rutas dinámicas:
- `/catalogo` → lista categorías de Sanity.
- `/catalogo/$categoria` → lista subcategorías de esa categoría.
- `/catalogo/$categoria/$subcategoria` → lista productos.
- `/producto/$slug` → detalle (ya existe, se adapta).

Así, **cuando el cliente cree una subcategoría "Smartwatches" en Sanity, aparece automáticamente** en menús, breadcrumbs, sitemap y navegación. No hay código que tocar.

### UI
- Header, dropdowns y footer se alimentan de la misma query (`getNavigation`) → consistencia automática.
- Placeholder visual si `imageUrl` falla (onError).
- `errorComponent` + `notFoundComponent` en cada ruta para que un fallo de Sanity muestre un mensaje, no una pantalla en blanco.

### Carrito
- Sin cambios funcionales: sigue en localStorage con la misma API (`useCart`).
- Limpieza al confirmar pago exitoso.

### SEO
- `sitemap.xml` consulta Sanity y lista todas las URLs vigentes.
- Metadatos por producto/categoría derivados de los campos de Sanity.

---

## Checkout con Stripe

Flujo cuando el usuario hace click en "Pagar":
1. ServerFn `createCheckoutSession` recibe los `cartItems`.
2. Re-valida precios contra Sanity (no se confía en el carrito del cliente → previene manipulación).
3. Crea una **Stripe Checkout Session** con `line_items` dinámicos (`price_data`) — no hay que sincronizar el catálogo a Stripe.
4. Configura envío (`shipping_address_collection` + `shipping_options`).
5. Devuelve `url` y redirige.
6. Stripe redirige a `/checkout/exito?session_id=...` o `/checkout/cancelado`.
7. Webhook en `/api/public/stripe-webhook` confirma el pago y guarda la orden (correo + número de seguimiento opcional).

Sin Lovable Cloud por ahora: la orden se puede guardar en Sanity (dataset privado) o emitir solo recibo por email. Si más adelante quieres dashboard de órdenes, agregamos Lovable Cloud sin tocar lo demás.

---

## Garantías de "no romper el website"

| Riesgo | Mitigación |
|---|---|
| Producto con campos faltantes | Zod descarta el doc; loggea pero no rompe el render |
| Imagen externa rota | `onError` muestra placeholder |
| Sanity caído | `errorComponent` por ruta + caché stale-while-revalidate (60 s) |
| Cliente borra una categoría con productos | Productos huérfanos se filtran en la query |
| Precio mal capturado | Schema de Sanity exige número ≥ 0; checkout re-valida server-side |
| Slug duplicado | Sanity Studio valida unicidad antes de publicar |
| Build falla por contenido | Las rutas son client-driven dynamic; el contenido nunca participa en build |

---

## Pasos de implementación (orden)

1. Conectar el conector **Sanity** vía MCP (lo gestiono yo, sin credenciales manuales).
2. Crear los 3 schemas en Sanity y poblarlos automáticamente con los datos actuales del catálogo (migración one-shot del `catalog.ts` existente).
3. Cliente Sanity + queries GROQ + serverFns con caché.
4. Refactor de rutas: borrar las 22 hardcodeadas, dejar 3 dinámicas.
5. Adaptar header/footer/breadcrumbs/sitemap para que lean de Sanity.
6. Validación Zod + estados de error/empty.
7. Habilitar **Stripe Payments** (built-in de Lovable).
8. ServerFn `createCheckoutSession` + páginas `/checkout/exito` y `/checkout/cancelado`.
9. Webhook de Stripe + envío de email de confirmación.
10. Quitar el flujo de WhatsApp del carrito (queda solo en contacto general).
11. Documentar para el cliente: "cómo crear un producto", "cómo desactivarlo", "cómo cambiar precio".

---

## Lo que el cliente verá

- Entra a `app.sanity.io` → Studio del proyecto.
- Crea "Producto" → llena título, sube link de imagen, asigna a subcategoría, pone precio en USD, click en *Publish*.
- En 60 segundos aparece en el sitio, en menús, en sitemap, con SEO y carrito funcionando. Sin builds, sin contactarte a ti.

---

## Lo que necesito de ti para empezar

- Confirmar que el dataset de Sanity será **production** (recomendado).
- Confirmar que Stripe estará en modo **test** primero y luego pasamos a **live** cuando verifiques la cuenta.
- ¿Quieres que conserve los productos de muestra actuales como seed inicial en Sanity, o empiezas con catálogo vacío?
