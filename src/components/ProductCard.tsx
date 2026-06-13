import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { type Product, formatPrice } from "@/lib/catalog.queries";
import { PLACEHOLDER_IMG } from "@/data/catalog";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [imgError, setImgError] = useState(false);
  const src = imgError ? PLACEHOLDER_IMG : product.imageUrl;
  return (
    <div className="group relative rounded-2xl bg-surface-container border border-outline-variant/20 overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(146,7,62,0.5)]">
      <Link to="/producto/$slug" params={{ slug: product.slug }} className="block">
        <div className="aspect-square bg-surface-container-lowest overflow-hidden">
          <img
            src={src}
            alt={product.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      {product.badge && (
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-container text-on-primary-container">
          {product.badge}
        </span>
      )}
      <div className="p-4">
        <Link to="/producto/$slug" params={{ slug: product.slug }}>
          <h2 className="font-semibold text-on-surface text-sm mb-1 line-clamp-2 min-h-[2.5rem] hover:text-primary-bright transition-colors">
            {product.title}
          </h2>
        </Link>
        {product.description && (
          <p className="text-xs text-on-surface-variant mb-3 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary-bright text-base">{formatPrice(product.priceUSD)}</span>
          <button
            type="button"
            onClick={() => add(product)}
            className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center"
            aria-label="Agregar al carrito"
          >
            <span className="material-symbols-outlined text-base">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
