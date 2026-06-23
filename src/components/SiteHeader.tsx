import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { fetchNavigation, type Category } from "@/lib/catalog.queries";
import logoAsset from "@/assets/spacephone-logo.jpg";

export function SiteHeader() {
  const { count } = useCart();
  const [nav, setNav] = useState<Category[]>([]);

  useEffect(() => {
    fetchNavigation()
      .then(setNav)
      .catch((err) => console.warn("[nav] no se pudo cargar:", err));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Space Phone — Inicio">
          <img src={logoAsset} alt="" className="h-9 w-auto" />
          <span className="font-semibold text-base text-on-surface">SpacePhone</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-3 py-2 text-sm text-on-surface-variant hover:text-primary-bright transition-colors"
          >
            Inicio
          </Link>
          <div className="relative group">
            <Link
              to="/catalogo"
              className="px-3 py-2 text-sm text-on-surface-variant hover:text-primary-bright transition-colors inline-flex items-center gap-1"
            >
              Catálogo
              {nav.length > 0 && (
                <span className="material-symbols-outlined text-base">expand_more</span>
              )}
            </Link>
            {nav.length > 0 && (
              <div className="absolute top-full left-0 mt-1 min-w-[480px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-2xl bg-surface-container border border-outline-variant/20 shadow-xl p-3 grid grid-cols-2 gap-1">
                {nav.map((cat) => (
                  <div key={cat._id} className="p-2">
                    <Link
                      to="/catalogo/$categoria"
                      params={{ categoria: cat.slug }}
                      className="block font-semibold text-sm text-on-surface mb-2 hover:text-primary-bright"
                    >
                      {cat.title}
                    </Link>
                    <ul className="space-y-1">
                      {cat.subcategories.map((s) => (
                        <li key={s._id}>
                          <Link
                            to="/catalogo/$categoria/$subcategoria"
                            params={{ categoria: cat.slug, subcategoria: s.slug }}
                            className="block text-xs text-on-surface-variant hover:text-primary-bright py-1"
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link
            to="/contacto"
            className="px-3 py-2 text-sm text-on-surface-variant hover:text-primary-bright transition-colors"
          >
            Contacto
          </Link>
        </nav>

        <Link
          to="/carrito"
          className="relative w-10 h-10 rounded-full bg-surface-container hover:bg-primary-container flex items-center justify-center text-on-surface"
          aria-label="Carrito"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
