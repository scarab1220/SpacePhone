import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";
import { BRANCHES, SOCIAL_LINKS, type Branch } from "@/data/catalog";

export const Route = createFileRoute("/sucursales/$slug")({
  loader: ({ params }) => {
    const branch = BRANCHES.find((b) => b.slug === params.slug);
    if (!branch) throw notFound();
    return { branch };
  },
  head: ({ loaderData }) => {
    const b = loaderData?.branch;
    const title = b ? `${b.brand} ${b.name} | Space Phone` : "Sucursal | Space Phone";
    const description = b
      ? `${b.brand} ${b.name}: ${b.address}. Conoce horarios y cómo llegar.`
      : "Sucursales de Space Phone.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: b ? `/sucursales/${b.slug}` : "/sucursales" },
        { property: "og:type", content: "website" },
      ],
      links: b ? [{ rel: "canonical", href: `/sucursales/${b.slug}` }] : [],
      scripts: b
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: `${b.brand} ${b.name}`,
                description: `${b.brand} ${b.name}: ${b.address}`,
                address: {
                  "@type": "PostalAddress",
                  streetAddress: b.address,
                  addressLocality: b.city,
                  addressCountry: "SV",
                },
                telephone: "+503 7779 3420",
                url: `/sucursales/${b.slug}`,
                openingHoursSpecification: b.hours.map((h) => ({
                  "@type": "OpeningHoursSpecification",
                  description: `${h.days}: ${h.time}`,
                })),
              }),
            },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", to: "/" },
        { label: "Sucursales", to: "/sucursales" },
        { label: "No encontrada" },
      ]}
      eyebrow="Sucursal"
      title="Sucursal no encontrada"
      icon="store"
    >
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6">
        <p className="text-on-surface-variant mb-4">No encontramos la sucursal que buscas.</p>
        <Link to="/sucursales" className="text-primary-bright font-medium hover:underline">
          Ver todas las sucursales
        </Link>
      </div>
    </InfoPage>
  ),
  errorComponent: () => (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", to: "/" },
        { label: "Sucursales", to: "/sucursales" },
        { label: "Error" },
      ]}
      eyebrow="Error"
      title="No pudimos cargar esta sucursal"
      icon="error"
    >
      <Link to="/sucursales" className="text-primary-bright font-medium hover:underline">
        Volver a sucursales
      </Link>
    </InfoPage>
  ),
  component: BranchDetail,
});

function BranchDetail() {
  const { branch } = Route.useLoaderData() as { branch: Branch };
  const mapsUrl = `https://maps.google.com/?q=${branch.mapsQuery}`;

  return (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", to: "/" },
        { label: "Sucursales", to: "/sucursales" },
        { label: branch.name },
      ]}
      eyebrow={branch.brand}
      title={`${branch.name}`}
      icon="storefront"
      description={`${branch.shortLocation}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary-bright">location_on</span>
            <div>
              <h2 className="text-base font-semibold text-on-surface mb-1">Dirección</h2>
              <p className="text-sm text-on-surface-variant">{branch.address}</p>
              <p className="text-sm text-on-surface-variant">{branch.shortLocation}</p>
            </div>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary-bright font-medium hover:underline"
          >
            Ver en Google Maps
            <span className="material-symbols-outlined text-base">arrow_outward</span>
          </a>
        </div>

        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8">
          <div className="flex items-start gap-3 mb-4">
            <span className="material-symbols-outlined text-primary-bright">schedule</span>
            <h2 className="text-base font-semibold text-on-surface">Horario</h2>
          </div>
          <ul className="space-y-2 text-sm">
            {branch.hours.map((h) => (
              <li
                key={h.days}
                className="flex justify-between gap-4 border-b border-outline-variant/10 pb-2 last:border-0"
              >
                <span className="text-on-surface-variant">{h.days}</span>
                <span className="text-on-surface font-medium">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-primary-container/30 border border-primary/20 p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary-bright shrink-0">
          <span className="material-symbols-outlined">chat</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-on-surface">
            ¿Tienes preguntas antes de visitarnos?
          </h3>
          <p className="text-sm text-on-surface-variant">
            Escríbenos por WhatsApp y con gusto te atendemos.
          </p>
        </div>
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          WhatsApp
        </a>
      </div>
    </InfoPage>
  );
}
