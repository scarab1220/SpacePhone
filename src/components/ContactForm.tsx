import { useState } from "react";
import { SOCIAL_LINKS } from "@/data/catalog";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initial: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

function validate(values: FormState): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  if (!name) errors.name = "Ingresa tu nombre";
  else if (name.length > 100) errors.name = "Máximo 100 caracteres";

  const email = values.email.trim();
  if (!email) errors.email = "Ingresa tu correo";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Correo inválido";
  else if (email.length > 255) errors.email = "Máximo 255 caracteres";

  const phone = values.phone.trim();
  if (phone && !/^[0-9+\-\s()]{6,20}$/.test(phone)) errors.phone = "Teléfono inválido";

  const subject = values.subject.trim();
  if (!subject) errors.subject = "Indica un asunto";
  else if (subject.length > 120) errors.subject = "Máximo 120 caracteres";

  const message = values.message.trim();
  if (!message) errors.message = "Escribe tu mensaje";
  else if (message.length > 1000) errors.message = "Máximo 1000 caracteres";

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
    };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const lines = [
      `Hola SpacePhone, soy ${values.name.trim()}.`,
      `Asunto: ${values.subject.trim()}`,
      "",
      values.message.trim(),
      "",
      `Correo: ${values.email.trim()}`,
      values.phone.trim() ? `Teléfono: ${values.phone.trim()}` : "",
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `${SOCIAL_LINKS.whatsapp}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    setValues(initial);
  };

  const inputBase =
    "w-full rounded-xl bg-surface-container-high border border-outline-variant/30 px-4 py-3 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-bright transition-colors";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="cf-name">
            Nombre *
          </label>
          <input
            id="cf-name"
            type="text"
            value={values.name}
            onChange={onChange("name")}
            maxLength={100}
            autoComplete="name"
            className={inputBase}
            placeholder="Tu nombre"
          />
          {errors.name && <p className="mt-1 text-xs text-brand-red">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="cf-email">
            Correo *
          </label>
          <input
            id="cf-email"
            type="email"
            value={values.email}
            onChange={onChange("email")}
            maxLength={255}
            autoComplete="email"
            className={inputBase}
            placeholder="tu@correo.com"
          />
          {errors.email && <p className="mt-1 text-xs text-brand-red">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="cf-phone">
            Teléfono (opcional)
          </label>
          <input
            id="cf-phone"
            type="tel"
            value={values.phone}
            onChange={onChange("phone")}
            maxLength={20}
            autoComplete="tel"
            className={inputBase}
            placeholder="7777 7777"
          />
          {errors.phone && <p className="mt-1 text-xs text-brand-red">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="cf-subject">
            Asunto *
          </label>
          <input
            id="cf-subject"
            type="text"
            value={values.subject}
            onChange={onChange("subject")}
            maxLength={120}
            className={inputBase}
            placeholder="Consulta sobre un producto"
          />
          {errors.subject && <p className="mt-1 text-xs text-brand-red">{errors.subject}</p>}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2" htmlFor="cf-message">
          Mensaje *
        </label>
        <textarea
          id="cf-message"
          value={values.message}
          onChange={onChange("message")}
          maxLength={1000}
          rows={5}
          className={`${inputBase} resize-y min-h-[120px]`}
          placeholder="Cuéntanos en qué te podemos ayudar..."
        />
        <div className="flex justify-between mt-1">
          {errors.message ? (
            <p className="text-xs text-brand-red">{errors.message}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-on-surface-variant">{values.message.length}/1000</p>
        </div>
      </div>

      {sent && (
        <div
          role="status"
          className="rounded-xl border border-primary/40 bg-primary-container/40 px-4 py-3 text-sm text-on-primary-container flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">check_circle</span>
          Se abrió WhatsApp con tu mensaje. ¡Gracias por contactarnos!
        </div>
      )}

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-magenta to-brand-orange text-on-surface font-semibold hover:opacity-90 transition-opacity"
      >
        <span className="material-symbols-outlined text-base">send</span>
        Enviar por WhatsApp
      </button>
      <p className="text-xs text-on-surface-variant">
        Al enviar, se abrirá tu WhatsApp con tu mensaje listo para enviarnos.
      </p>
    </form>
  );
}
