// Datos no-catalogados (redes sociales, imagen placeholder).
// El catálogo de productos/categorías ahora vive en Sanity:
// ver src/lib/sanity.ts y src/lib/catalog.queries.ts

import placeholderImg from "@/assets/gadget-phone.jpg";

export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/50377793420",
  messenger: "https://m.me/spacephone",
  instagram: "https://www.instagram.com/space_phonesv/",
  facebook: "https://facebook.com/spacephone",
};

export const PLACEHOLDER_IMG = placeholderImg;

export const CONTACT_INFO = {
  phone: "7779 3420",
  phoneHref: "https://wa.me/50377793420",
  email: "spacefon.ventas@gmail.com",
  emailHref: "mailto:spacefon.ventas@gmail.com",
} as const;

export type Branch = {
  slug: string;
  brand: string;
  name: string;
  city: string;
  shortLocation: string;
  address: string;
  hours: { days: string; time: string }[];
  mapsQuery: string;
};

export const BRANCHES: Branch[] = [
  {
    slug: "metrocentro",
    brand: "CLICK•BOX",
    name: "Metrocentro",
    city: "San Salvador",
    shortLocation: "Metrocentro, San Salvador",
    address: "11ª etapa, local Click Box, abajo de KFC y Pavito Criollo",
    hours: [
      { days: "Lunes a sábado", time: "9:00 am – 7:00 pm" },
      { days: "Domingos", time: "10:00 am – 6:00 pm" },
    ],
    mapsQuery: "Metrocentro+San+Salvador+11a+etapa+Click+Box",
  },
  {
    slug: "metrosur",
    brand: "SPACE STORE",
    name: "Metrosur",
    city: "San Salvador",
    shortLocation: "Metrosur, San Salvador",
    address: "Local C-17, contiguo a Dental Fresh, pasillo de ANDA",
    hours: [
      { days: "Lunes a viernes", time: "9:30 am – 6:00 pm" },
      { days: "Sábado", time: "9:00 am – 2:00 pm" },
      { days: "Domingo", time: "Cerrado" },
    ],
    mapsQuery: "Metrosur+San+Salvador+local+C-17",
  },
  {
    slug: "plaza-mundo",
    brand: "CLICK•BOX",
    name: "Plaza Mundo Soyapango",
    city: "Soyapango",
    shortLocation: "Plaza Mundo, Soyapango",
    address: "Primera etapa, local 85, justo abajo del cine",
    hours: [
      { days: "Lunes a sábado", time: "9:00 am – 7:00 pm" },
      { days: "Domingos", time: "10:00 am – 6:00 pm" },
    ],
    mapsQuery: "Plaza+Mundo+Soyapango+primera+etapa+local+85",
  },
];

// Fallback estático del menú principal cuando Sanity aún no está poblado.
// Una vez que el cliente cree categorías en Sanity, el header las usa.
export const STATIC_NAV_FALLBACK = [
  { label: "Catálogo", to: "/catalogo" },
  { label: "Contacto", to: "/contacto" },
] as const;
