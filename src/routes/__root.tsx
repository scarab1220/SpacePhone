import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import logoAsset from "@/assets/spacephone-logo.jpg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-on-surface">404</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Page not found</p>
        <Link to="/" className="mt-6 inline-flex rounded-full px-4 py-2 btn-primary text-white">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-on-surface">This page didn't load</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Something went wrong.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-full px-4 py-2 btn-primary text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Space Phone | Smartphones y Accesorios" },
      { name: "description", content: "Smartphones Android, iPhone, accesorios y promociones. Garantía incluida y métodos de pago flexibles." },
      { property: "og:site_name", content: "Space Phone" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Space Phone | Smartphones y Accesorios" },
      { property: "og:description", content: "Smartphones Android, iPhone, accesorios y promociones con garantía." },
      { property: "og:image", content: logoAsset },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Space Phone | Smartphones y Accesorios" },
      { name: "twitter:description", content: "Smartphones Android, iPhone, accesorios y promociones con garantía." },
      { name: "twitter:image", content: logoAsset },
    ],
    links: [
      { rel: "icon", type: "image/jpeg", href: logoAsset },
      { rel: "apple-touch-icon", href: logoAsset },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Space Phone",
          description: "Tienda de smartphones Android, iPhone y accesorios con garantía. 3 sucursales en El Salvador.",
          url: "/",
          telephone: "+50377793420",
          email: "spacefon.ventas@gmail.com",
          location: [
            {
              "@type": "Place",
              name: "CLICK•BOX Metrocentro",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Metrocentro, 11ª etapa, local Click Box, abajo de KFC y Pavito Criollo",
                addressLocality: "San Salvador",
                addressCountry: "SV",
              },
            },
            {
              "@type": "Place",
              name: "SPACE STORE Metrosur",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Metrosur, local C-17, contiguo a Dental Fresh, pasillo de ANDA",
                addressLocality: "San Salvador",
                addressCountry: "SV",
              },
            },
            {
              "@type": "Place",
              name: "CLICK•BOX Plaza Mundo Soyapango",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Plaza Mundo Soyapango, primera etapa, local 85, abajo del cine",
                addressLocality: "Soyapango",
                addressCountry: "SV",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Space Phone",
          url: "/",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartProvider } from "@/lib/cart";
import { WhatsAppChat } from "@/components/WhatsAppChat";
import { ScrollToTop } from "@/components/ScrollToTop";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SiteHeader />
        <Outlet />
        <SiteFooter />
        <WhatsAppChat />
        <ScrollToTop />
      </CartProvider>
    </QueryClientProvider>
  );
}

