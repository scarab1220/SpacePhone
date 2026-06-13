import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";

export const Route = createFileRoute("/envios")({
  head: () => ({
    meta: [
      { title: "Envíos | Space Phone" },
      { name: "description", content: "Conoce nuestras opciones de envío, tiempos de entrega y costos." },
      { property: "og:title", content: "Envíos | Space Phone" },
      { property: "og:description", content: "Opciones de envío, tiempos y costos en Space Phone." },
      { property: "og:url", content: "/envios" },
    ],
    links: [{ rel: "canonical", href: "/envios" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Envíos" }]}
      eyebrow="Información"
      title="Envíos y entregas"
      icon="local_shipping"
      description="Enviamos a todo el país con paqueterías confiables."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: "flash_on", title: "Express", text: "1 a 2 días hábiles en zonas metropolitanas." },
          { icon: "local_shipping", title: "Estándar", text: "3 a 5 días hábiles a todo el país." },
          { icon: "store", title: "En tienda", text: "Recoge sin costo en nuestra sucursal." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl bg-surface-container border border-outline-variant/20 p-5">
            <span className="material-symbols-outlined text-primary-bright mb-2 block">{c.icon}</span>
            <h4 className="font-semibold text-on-surface mb-1">{c.title}</h4>
            <p className="text-sm text-on-surface-variant">{c.text}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 text-on-surface-variant space-y-3">
        <h3 className="text-lg font-semibold text-on-surface">Detalles importantes</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Costo de envío calculado al confirmar tu pedido según tu CP.</li>
          <li>Envío gratis en compras mayores a $250.00 USD.</li>
          <li>Todos los paquetes incluyen guía y seguro.</li>
          <li>Recibirás un número de rastreo por WhatsApp.</li>
        </ul>
      </div>
    </InfoPage>
  ),
});
