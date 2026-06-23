import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y condiciones | Space Phone" },
      {
        name: "description",
        content: "Términos y condiciones de uso del sitio y compras en Space Phone.",
      },
      { property: "og:title", content: "Términos y condiciones | Space Phone" },
      {
        property: "og:description",
        content: "Términos y condiciones de uso del sitio y compras en Space Phone.",
      },
      { property: "og:url", content: "/terminos" },
    ],
    links: [{ rel: "canonical", href: "/terminos" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Términos" }]}
      eyebrow="Legal"
      title="Términos y condiciones"
      icon="gavel"
      description="Al usar este sitio aceptas los siguientes términos."
    >
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 text-on-surface-variant space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-2">1. Uso del sitio</h2>
          <p>
            El contenido publicado es informativo. Los precios y disponibilidad pueden cambiar sin
            previo aviso.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-2">2. Compras</h2>
          <p>
            Toda compra se confirma a través de nuestros canales de contacto (WhatsApp, Messenger,
            Instagram). Una vez confirmada, se procede al pago y envío.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-2">3. Pagos</h2>
          <p>
            Aceptamos efectivo, transferencias bancarias y tarjetas de crédito (con tasa cero en
            bancos seleccionados).
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-2">4. Garantía y devoluciones</h2>
          <p>
            Consulta las páginas de{" "}
            <a href="/garantia" className="text-primary-bright hover:underline">
              Garantía
            </a>{" "}
            y{" "}
            <a href="/envios" className="text-primary-bright hover:underline">
              Envíos
            </a>{" "}
            para más detalles.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-2">5. Privacidad</h2>
          <p>
            Tus datos se utilizan únicamente para procesar tu pedido y brindar soporte. No los
            compartimos con terceros.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-on-surface mb-2">6. Modificaciones</h2>
          <p>Nos reservamos el derecho de actualizar estos términos en cualquier momento.</p>
        </section>
      </div>
    </InfoPage>
  ),
});
