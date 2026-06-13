import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/PageLayout";

export const Route = createFileRoute("/garantia")({
  head: () => ({
    meta: [
      { title: "Política de Cambios, Devoluciones y Garantía | Space Phone" },
      { name: "description", content: "Política de cambios, devoluciones y garantía para smartphones y accesorios en Space Phone." },
      { property: "og:title", content: "Política de Cambios, Devoluciones y Garantía | Space Phone" },
      { property: "og:description", content: "Conoce nuestra política de cambios, devoluciones y garantía." },
      { property: "og:url", content: "/garantia" },
    ],
    links: [{ rel: "canonical", href: "/garantia" }],
  }),
  component: () => (
    <InfoPage
      breadcrumbs={[{ label: "Inicio", to: "/" }, { label: "Política" }]}
      eyebrow="Política"
      title="Cambios, Devoluciones y Garantía"
      icon="verified_user"
      description="No realizamos devoluciones de dinero ni cambios de producto por decisión del cliente una vez completada la compra y entregado el producto."
    >
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 mb-8">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-error text-3xl flex-shrink-0">cancel</span>
          <div>
            <h3 className="text-lg font-semibold text-on-surface">No realizamos devoluciones ni cambios por decisión del cliente</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Una vez completada la compra y entregado el producto, no se realizan devoluciones de dinero ni cambios de producto por decisión del cliente. Asegúrate de revisar bien tu compra antes de confirmarla.
            </p>
          </div>
        </div>
      </div>


      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8 text-on-surface-variant space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">¿Qué cubre la garantía?</h3>
        <p className="text-sm">
          Todos nuestros productos cuentan con garantía contra defectos de fábrica durante el período correspondiente a cada categoría. Si el producto presenta una falla cubierta por la garantía, será evaluado por nuestro equipo técnico y, según corresponda, podrá ser reparado o reemplazado.
        </p>

        <h3 className="text-lg font-semibold text-on-surface pt-2">¿Qué NO cubre la garantía?</h3>
        <p className="text-sm">
          La garantía no cubre daños causados por golpes, líquidos, manipulación no autorizada, desgaste normal por uso u otras causas ajenas a defectos de fabricación.
        </p>

        <div className="rounded-xl bg-warning/10 border border-warning/20 p-4 mt-4">
          <p className="text-sm text-on-surface font-medium">
            Importante: la garantía solo cubre defectos de fábrica. En ningún caso implica cambio de producto por otro modelo, devolución de dinero o reintegro parcial.
          </p>
        </div>
      </div>
    </InfoPage>
  ),
});
