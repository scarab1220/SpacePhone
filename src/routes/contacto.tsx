import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/PageLayout";
import { ContactForm } from "@/components/ContactForm";
import { SOCIAL_LINKS, CONTACT_INFO, BRANCHES } from "@/data/catalog";
import heroBg from "@/assets/hero-contacto.jpg";

const channels = [
  {
    name: "WhatsApp",
    icon: "chat",
    description: "Respuesta inmediata de lunes a sábado.",
    href: SOCIAL_LINKS.whatsapp,
    cta: "Abrir WhatsApp",
    color: "from-green-500/30 to-emerald-500/10",
  },
  {
    name: "Facebook Messenger",
    icon: "forum",
    description: "Chatea con nosotros desde Facebook.",
    href: SOCIAL_LINKS.messenger,
    cta: "Abrir Messenger",
    color: "from-blue-500/30 to-sky-500/10",
  },
  {
    name: "Instagram",
    icon: "photo_camera",
    description: "Envíanos un DM y te respondemos rápido.",
    href: SOCIAL_LINKS.instagram,
    cta: "Abrir Instagram",
    color: "from-pink-500/30 to-fuchsia-500/10",
  },
];

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | Space Phone" },
      { name: "description", content: "Contáctanos por WhatsApp, Messenger, Instagram, teléfono o correo. Visítanos en nuestras 3 sucursales." },
      { property: "og:title", content: "Contacto | Space Phone" },
      { property: "og:description", content: "Contáctanos por WhatsApp, Messenger, Instagram, teléfono o correo. Visítanos en nuestras 3 sucursales." },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: () => (
    <main className="min-h-screen pb-24">
      <Breadcrumbs trail={[{ label: "Inicio", to: "/" }, { label: "Contacto" }]} />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-widest text-on-primary-container bg-primary-container rounded-full">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            Estamos para ayudarte
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-on-surface tracking-tight mb-6">
            Contacto
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
            Elige el canal que prefieras y nuestro equipo te responderá lo antes posible.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/sucursales"
            className="group relative overflow-hidden rounded-2xl border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all bg-gradient-to-br from-orange-500/30 to-amber-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 text-primary-bright">
              <span className="material-symbols-outlined">store</span>
            </div>
            <h2 className="text-lg font-semibold text-on-surface mb-1">Sucursales</h2>
            <p className="text-sm text-on-surface-variant mb-4">Tenemos 3 puntos de venta para atenderte.</p>
            <span className="inline-flex items-center gap-1 text-sm text-primary-bright font-medium">
              Ver sucursales <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
          </Link>
          <a
            href={CONTACT_INFO.phoneHref}
            className="group relative overflow-hidden rounded-2xl border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all bg-gradient-to-br from-blue-500/30 to-sky-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 text-primary-bright">
              <span className="material-symbols-outlined">phone</span>
            </div>
            <h2 className="text-lg font-semibold text-on-surface mb-1">Teléfono</h2>
            <p className="text-sm text-on-surface-variant mb-4">{CONTACT_INFO.phone}</p>
            <span className="inline-flex items-center gap-1 text-sm text-primary-bright font-medium">
              Llamar <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_outward</span>
            </span>
          </a>
          <a
            href={CONTACT_INFO.emailHref}
            className="group relative overflow-hidden rounded-2xl border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all bg-gradient-to-br from-purple-500/30 to-violet-500/10"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 text-primary-bright">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <h2 className="text-lg font-semibold text-on-surface mb-1">Correo electrónico</h2>
            <p className="text-sm text-on-surface-variant mb-4">{CONTACT_INFO.email}</p>
            <span className="inline-flex items-center gap-1 text-sm text-primary-bright font-medium">
              Enviar correo <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_outward</span>
            </span>
          </a>
        </div>

        <div className="mt-8 rounded-2xl bg-surface-container border border-outline-variant/20 p-6 md:p-8">
          <h2 className="text-sm uppercase tracking-wider text-primary-bright font-semibold mb-1">Escríbenos</h2>
          <p className="text-2xl md:text-3xl font-bold text-on-surface mb-1">Envíanos un mensaje</p>
          <p className="text-sm text-on-surface-variant mb-6">Completa el formulario y te responderemos en breve.</p>
          <ContactForm />
        </div>

        <div className="mt-8 rounded-2xl bg-surface-container border border-outline-variant/20 p-6">
          <h2 className="text-sm uppercase tracking-wider text-primary-bright font-semibold mb-3">Nuestras sucursales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BRANCHES.map((b) => (
              <Link
                key={b.slug}
                to="/sucursales/$slug"
                params={{ slug: b.slug }}
                className="group rounded-2xl bg-surface-container-high border border-outline-variant/20 p-5 hover:border-primary/50 transition-all"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-bright mb-1">{b.brand}</p>
                <h3 className="text-base font-semibold text-on-surface mb-1">{b.name}</h3>
                <p className="text-sm text-on-surface-variant">{b.address}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-surface-container border border-outline-variant/20 p-6">
          <h2 className="text-sm uppercase tracking-wider text-primary-bright font-semibold mb-3">También por redes sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className={`group relative overflow-hidden rounded-2xl border border-outline-variant/20 p-6 hover:border-primary/50 hover:-translate-y-1 transition-all bg-gradient-to-br ${c.color}`}
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-4 text-primary-bright">
                  <span className="material-symbols-outlined">{c.icon}</span>
                </div>
                <h2 className="text-lg font-semibold text-on-surface mb-1">{c.name}</h2>
                <p className="text-sm text-on-surface-variant mb-4">{c.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-primary-bright font-medium">
                  {c.cta} <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_outward</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container p-6 md:p-8">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-magenta/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-bright mb-1">Síguenos</p>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-1">Únete a la comunidad Space Phone</h2>
            <p className="text-sm text-on-surface-variant mb-6 max-w-md">Lanzamientos, ofertas y novedades antes que nadie. Te esperamos.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-outline-variant/20 p-5 flex items-center gap-4 hover:border-brand-magenta/60 hover:-translate-y-0.5 transition-all bg-gradient-to-br from-brand-purple/30 via-brand-magenta/20 to-transparent"
              >
                <div className="w-12 h-12 rounded-xl bg-on-surface/5 backdrop-blur flex items-center justify-center text-on-surface shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">public</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-on-surface">Facebook</p>
                  <p className="text-xs text-on-surface-variant truncate">@spacePhoneSV</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-bright group-hover:translate-x-1 transition-all">arrow_outward</span>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-outline-variant/20 p-5 flex items-center gap-4 hover:border-brand-orange/60 hover:-translate-y-0.5 transition-all bg-gradient-to-br from-brand-red/30 via-brand-orange/20 to-brand-yellow/10"
              >
                <div className="w-12 h-12 rounded-xl bg-on-surface/5 backdrop-blur flex items-center justify-center text-on-surface shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">photo_camera</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-on-surface">Instagram</p>
                  <p className="text-xs text-on-surface-variant truncate">@space_phonesv</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-bright group-hover:translate-x-1 transition-all">arrow_outward</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  ),
});
