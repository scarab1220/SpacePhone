import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";

export const Route = createFileRoute("/metodos-de-pago/efectivo")({
  head: () => ({
    meta: [
      { title: "Pago en Efectivo | Space Phone" },
      { name: "description", content: "Paga en efectivo al recibir o en tienda. Sin recargos ni comisiones." },
      { property: "og:title", content: "Pago en Efectivo | Space Phone" },
      { property: "og:description", content: "Paga en efectivo al recibir o en tienda. Sin recargos." },
      { property: "og:url", content: "/metodos-de-pago/efectivo" },
    ],
    links: [{ rel: "canonical", href: "/metodos-de-pago/efectivo" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", to: "/" },
        { label: "Métodos de Pago", to: "/metodos-de-pago" },
        { label: "Efectivo" },
      ]}
      eyebrow="Pago"
      title="Efectivo"
      icon="payments"
      description="Paga en efectivo directamente en nuestra tienda."
    >
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 space-y-4 text-on-surface-variant">
        <h3 className="text-xl font-semibold text-on-surface">¿Cómo funciona?</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Selecciona tus productos y coordina tu compra con nuestro equipo.</li>
          <li>Visítanos en cualquiera de nuestras <a href="/sucursales" className="text-primary-bright hover:underline">3 sucursales</a> (Metrocentro, Metrosur o Plaza Mundo Soyapango).</li>
          <li>Paga en efectivo al retirar tu pedido.</li>
        </ol>
        <p>Sin recargos ni comisiones adicionales.</p>
      </div>
    </InfoPage>
  ),
});
