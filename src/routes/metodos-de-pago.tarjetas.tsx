import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";

const tasaCeroBanks = [
  { name: "Banco Agrícola", icon: "account_balance" },
  { name: "Davivienda", icon: "account_balance" },
  { name: "BAC Credomatic", icon: "account_balance" },
  { name: "Promerica", icon: "account_balance" },
];

export const Route = createFileRoute("/metodos-de-pago/tarjetas")({
  head: () => ({
    meta: [
      { title: "Tarjetas de crédito | Space Phone" },
      {
        name: "description",
        content: "Pago con tarjetas de crédito y opciones a tasa cero con bancos seleccionados.",
      },
      { property: "og:title", content: "Tarjetas de crédito | Space Phone" },
      {
        property: "og:description",
        content: "Pago con tarjetas de crédito y opciones a tasa cero con bancos seleccionados.",
      },
      { property: "og:url", content: "/metodos-de-pago/tarjetas" },
    ],
    links: [{ rel: "canonical", href: "/metodos-de-pago/tarjetas" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", to: "/" },
        { label: "Métodos de Pago", to: "/metodos-de-pago" },
        { label: "Tarjetas de crédito" },
      ]}
      eyebrow="Pago"
      title="Tarjetas de crédito"
      icon="credit_card"
      description="Aceptamos pagos con tarjetas de crédito. Aprovecha la tasa cero con bancos seleccionados."
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 space-y-3 text-on-surface-variant">
          <h3 className="text-xl font-semibold text-on-surface">Pago con tarjeta</h3>
          <p>
            Aceptamos las principales tarjetas de crédito. Coordina tu compra con nuestro equipo y
            procesamos el pago de forma rápida y segura.
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container/50 flex items-center justify-center text-primary-bright shrink-0">
              <span className="material-symbols-outlined">percent</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-on-surface">Tasa cero</h3>
              <p className="text-sm text-on-surface-variant">
                Difiere tu compra sin intereses con los siguientes bancos:
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {tasaCeroBanks.map((b) => (
              <div
                key={b.name}
                className="rounded-xl bg-surface-container-high p-4 flex flex-col items-center text-center gap-2"
              >
                <span className="material-symbols-outlined text-primary-bright">{b.icon}</span>
                <p className="text-sm font-medium text-on-surface">{b.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InfoPage>
  ),
});
