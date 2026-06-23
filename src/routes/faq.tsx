import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";

const faqs = [
  {
    q: "¿Los equipos son nuevos y originales?",
    a: "Sí, todos nuestros equipos nuevos son 100% originales, sellados y con garantía de fábrica.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos efectivo, transferencias bancarias y tarjetas de crédito, con opciones de tasa cero con Banco Agrícola, Davivienda, BAC Credomatic y Promerica.",
  },
  {
    q: "¿Puedo cambiar o devolver un producto?",
    a: "Sí, dentro de los primeros 7 días siempre que el producto esté en perfectas condiciones.",
  },
  {
    q: "¿Tienen tienda física?",
    a: "Sí. Puedes coordinar la visita por WhatsApp para conocer nuestra ubicación y horario.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Preguntas frecuentes | Space Phone" },
      {
        name: "description",
        content: "Resuelve tus dudas sobre garantías, pagos, envíos y devoluciones.",
      },
      { property: "og:title", content: "Preguntas frecuentes | Space Phone" },
      {
        property: "og:description",
        content: "Resuelve tus dudas sobre garantías, pagos, envíos y devoluciones.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqJsonLd) }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "FAQ" }]}
      eyebrow="Ayuda"
      title="Preguntas frecuentes"
      icon="help"
      description="Todo lo que necesitas saber antes de comprar."
    >
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl bg-surface-container border border-outline-variant/20 p-5 open:border-primary/40 transition-all"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-on-surface">
              {f.q}
              <span className="material-symbols-outlined text-primary-bright group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <p className="mt-3 text-on-surface-variant text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </InfoPage>
  ),
});
