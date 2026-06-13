import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`
        fixed right-6 z-50 flex items-center justify-center
        w-14 h-14 rounded-full shadow-lg
        bg-gradient-to-br from-primary to-magenta
        text-white cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl
        ${visible ? "bottom-6 opacity-100 translate-y-0" : "bottom-6 opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <ArrowUp size={24} strokeWidth={2.5} />
    </button>
  );
}
