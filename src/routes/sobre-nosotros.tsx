import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";
import { BRANCHES, CONTACT_INFO } from "@/data/catalog";

export const Route = createFileRoute("/sobre-nosotros")({
  head: () => ({
    meta: [
      { title: "Sobre nosotros | Space Phone" },
      {
        name: "description",
        content: "Conoce Space Phone: la tienda de smartphones y accesorios con la mejor atención.",
      },
      { property: "og:title", content: "Sobre nosotros | Space Phone" },
      {
        property: "og:description",
        content: "Conoce Space Phone: la tienda de smartphones y accesorios con la mejor atención.",
      },
      { property: "og:url", content: "/sobre-nosotros" },
    ],
    links: [{ rel: "canonical", href: "/sobre-nosotros" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Sobre nosotros" }]}
      eyebrow="Quiénes somos"
      title="Sobre nosotros"
      icon="diversity_3"
      description="Somos una tienda especializada en smartphones, accesorios y soluciones tecnológicas para todos."
    >
      <div className="space-y-6 text-on-surface-variant">
        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-on-surface mb-3">Nuestra misión</h2>
          <p>
            Ofrecer la mejor experiencia de compra de smartphones y accesorios: equipos originales,
            precios justos, garantía y un servicio cercano que te asesora antes y después de tu
            compra.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "verified",
              title: "Calidad garantizada",
              text: "Equipos originales con garantía.",
            },
            {
              icon: "support_agent",
              title: "Atención personalizada",
              text: "Te asesoramos por WhatsApp.",
            },
            {
              icon: "rocket_launch",
              title: "Envíos rápidos",
              text: "A todo el país en pocos días.",
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-2xl bg-surface-container border border-outline-variant/20 p-5"
            >
              <span className="material-symbols-outlined text-primary-bright mb-2 block">
                {b.icon}
              </span>
              <h3 className="font-semibold text-on-surface mb-1">{b.title}</h3>
              <p className="text-sm">{b.text}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 mt-6">
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <h2 className="text-xl font-semibold text-on-surface">Visítanos</h2>
            <Link
              to="/sucursales"
              className="text-sm text-primary-bright font-medium hover:underline inline-flex items-center gap-1"
            >
              Ver todas las sucursales
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BRANCHES.map((b) => (
              <Link
                key={b.slug}
                to="/sucursales/$slug"
                params={{ slug: b.slug }}
                className="rounded-xl bg-surface-container-high p-4 hover:bg-surface-container-highest transition-colors"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-bright mb-1">
                  {b.brand}
                </p>
                <p className="font-medium text-on-surface mb-1">{b.name}</p>
                <p className="text-sm">{b.address}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-outline-variant/10 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-bright text-base">phone</span>{" "}
              <a href={CONTACT_INFO.phoneHref} className="hover:text-primary-bright">
                {CONTACT_INFO.phone}
              </a>
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-bright text-base">mail</span>{" "}
              <a href={CONTACT_INFO.emailHref} className="hover:text-primary-bright">
                {CONTACT_INFO.email}
              </a>
            </span>
          </div>
        </div>
      </div>
    </InfoPage>
  ),
});
