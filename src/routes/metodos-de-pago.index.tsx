import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";

const methods = [
  {
    slug: "efectivo",
    icon: "payments",
    name: "Efectivo",
    description: "Paga en efectivo directamente en nuestra tienda.",
  },
  {
    slug: "transferencia",
    icon: "account_balance",
    name: "Transferencias bancarias",
    description: "Realiza una transferencia desde tu banco y confirma tu pedido.",
  },
  {
    slug: "tarjetas",
    icon: "credit_card",
    name: "Tarjetas de crédito",
    description: "Aceptamos tarjetas de crédito con opciones a tasa cero.",
  },
];

export const Route = createFileRoute("/metodos-de-pago/")({
  head: () => ({
    meta: [
      { title: "Métodos de Pago | Space Phone" },
      {
        name: "description",
        content:
          "Aceptamos efectivo, transferencias bancarias y tarjetas de crédito con tasa cero.",
      },
      { property: "og:title", content: "Métodos de Pago | Space Phone" },
      {
        property: "og:description",
        content:
          "Aceptamos efectivo, transferencias bancarias y tarjetas de crédito con tasa cero.",
      },
      { property: "og:url", content: "/metodos-de-pago" },
    ],
    links: [{ rel: "canonical", href: "/metodos-de-pago" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Métodos de Pago" }]}
      eyebrow="Pagos"
      title="Métodos de Pago"
      description="Elige la forma de pago que más te convenga. Todas son rápidas y seguras."
      icon="account_balance_wallet"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((m) => (
          <Link
            key={m.slug}
            to={`/metodos-de-pago/${m.slug}`}
            className="group rounded-2xl bg-surface-container border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-container/50 flex items-center justify-center mb-4 text-primary-bright">
              <span className="material-symbols-outlined">{m.icon}</span>
            </div>
            <h2 className="text-lg font-semibold text-on-surface mb-1">{m.name}</h2>
            <p className="text-sm text-on-surface-variant mb-4">{m.description}</p>
            <span className="text-sm text-primary-bright font-medium inline-flex items-center gap-1">
              Más info{" "}
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-primary-container/30 border border-primary/20 p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary-bright shrink-0">
          <span className="material-symbols-outlined">percent</span>
        </div>
        <div>
          <h3 className="text-base font-semibold text-on-surface mb-1">Tasa cero disponible</h3>
          <p className="text-sm text-on-surface-variant">
            Difiere tu compra sin intereses pagando con tarjeta de crédito de Banco Agrícola,
            Davivienda, BAC Credomatic o Promerica.
          </p>
        </div>
      </div>
    </InfoPage>
  ),
});
