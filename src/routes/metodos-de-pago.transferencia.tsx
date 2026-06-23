import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";
import { SOCIAL_LINKS } from "@/data/catalog";

export const Route = createFileRoute("/metodos-de-pago/transferencia")({
  head: () => ({
    meta: [
      { title: "Transferencias Bancarias | Space Phone" },
      {
        name: "description",
        content: "Paga por transferencia bancaria. Solicita los datos de la cuenta por WhatsApp.",
      },
      { property: "og:title", content: "Transferencias Bancarias | Space Phone" },
      {
        property: "og:description",
        content: "Paga por transferencia bancaria. Solicita los datos de la cuenta por WhatsApp.",
      },
      { property: "og:url", content: "/metodos-de-pago/transferencia" },
    ],
    links: [{ rel: "canonical", href: "/metodos-de-pago/transferencia" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[
        { label: "Inicio", to: "/" },
        { label: "Métodos de Pago", to: "/metodos-de-pago" },
        { label: "Transferencias bancarias" },
      ]}
      eyebrow="Pago"
      title="Transferencias bancarias"
      icon="account_balance"
      description="Paga por transferencia desde tu banco de forma rápida y segura."
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 space-y-4 text-on-surface-variant">
          <h3 className="text-xl font-semibold text-on-surface">¿Cómo funciona?</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Escríbenos por WhatsApp y te enviamos los datos bancarios.</li>
            <li>Realiza la transferencia desde tu banco.</li>
            <li>Envíanos el comprobante por WhatsApp para confirmar tu pedido.</li>
          </ol>
        </div>

        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-primary-container/40 border border-primary/30 p-6 flex items-center gap-4 hover:border-primary transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary-bright shrink-0">
            <span className="material-symbols-outlined">chat</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-on-surface">
              Solicita los datos por WhatsApp
            </h3>
            <p className="text-sm text-on-surface-variant">
              Te compartimos la cuenta para realizar tu transferencia.
            </p>
          </div>
          <span className="material-symbols-outlined text-primary-bright">arrow_forward</span>
        </a>
      </div>
    </InfoPage>
  ),
});
