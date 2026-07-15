# Space Phone

Space Phone es una tienda web de smartphones y accesorios construida con TanStack Start, React y Vite. El sitio esta pensado para mostrar un catalogo navegable, productos destacados, paginas informativas y canales de contacto, con SSR, SEO y una base de contenido simple de mantener.

## Caracteristicas

- Home con hero principal, categorias y productos destacados.
- Catalogo navegable por categorias y subcategorias.
- Paginas para producto, carrito, contacto, sucursales, envios, garantia, FAQ, terminos y metodos de pago.
- Catalogo administrado desde un archivo JSON, sin base de datos.
- Renderizado del lado del servidor con rutas tipadas via TanStack Router.
- UI construida con Radix UI, Tailwind CSS 4 y componentes reutilizables.
- Preparado para despliegue en Netlify y Vercel.

## Stack

- TanStack Start
- TanStack Router
- React 19
- Vite
- Tailwind CSS 4
- Radix UI
- React Query
- React Hook Form
- Zod
- Lucide React
- Recharts

## Requisitos

- Node.js 22 o superior.
- npm.

## Primeros pasos

1. Instala dependencias:

	```bash
	npm install
	```

2. Inicia el entorno de desarrollo:

	```bash
	npm run dev
	```

3. Abre la URL que muestra Vite en la terminal.

## Scripts disponibles

- `npm run dev`: levanta la app en modo desarrollo.
- `npm run build`: genera el build de produccion.
- `npm run build:dev`: genera el build usando el modo development.
- `npm run preview`: sirve el build localmente para revisarlo antes de desplegar.
- `npm run lint`: ejecuta ESLint en todo el proyecto.
- `npm run format`: formatea el codigo con Prettier.

## Estructura del proyecto

- `src/routes/`: paginas y rutas de la aplicacion.
- `src/components/`: componentes reutilizables de UI.
- `src/data/catalog.json`: fuente principal del catalogo.
- `src/lib/`: queries, utilidades y configuracion de servidor.
- `src/assets/`: imagenes y recursos del sitio.
- `public/`: archivos publicos servidos directamente.
- `docs/CATALOG.md`: guia rapida para editar el catalogo.

## Catalogo de productos

El catalogo vive en `src/data/catalog.json`. Para agregar o editar contenido:

1. Abre `src/data/catalog.json`.
2. Copia un producto o categoria existente como plantilla.
3. Mantiene `slug` unicos y URL-safe.
4. Asegurate de que `categorySlug` y `subcategorySlug` apunten a categorias existentes.
5. Usa URLs publicas para las imagenes y precios en USD como numero.

Mas detalles estan en `docs/CATALOG.md`.

## Despliegue

El proyecto ya incluye configuracion para:

- Netlify: `netlify.toml` publica `dist/client` y usa funciones desde `dist/server`.
- Vercel: `vercel.json` apunta el output a `dist/client` y enruta a `/api/server`.

Antes de desplegar, ejecuta `npm run build` para verificar que la compilacion sea correcta.

## Notas

- No hay variables de entorno obligatorias para la configuracion actual.
- Si agregas servicios externos o secretos de servidor, documentalos aqui.

