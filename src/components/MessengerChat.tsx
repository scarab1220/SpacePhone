import { useState } from "react";

const MESSENGER_URL = "https://m.me/SpacePhoneSV";

export function MessengerChat() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {isHovered && (
        <div className="rounded-xl bg-surface-container-high px-4 py-2 text-sm text-on-surface shadow-lg border border-outline-variant animate-in fade-in slide-in-from-right-2 duration-200">
          Chatea con nosotros
        </div>
      )}
      <a
        href={MESSENGER_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir chat de Messenger"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #0099FF 0%, #006AFF 100%)",
          boxShadow: "0 4px 20px rgba(0, 105, 255, 0.45)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="h-7 w-7"
        >
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.94 1.44 5.57 3.69 7.28V22l3.3-1.83c.88.24 1.82.38 2.8.38.23 0 .45-.01.67-.03A7.94 7.94 0 0 1 12 20c4.42 0 8-3.22 8-7.2C20 6.13 15.64 2 12 2z" />
        </svg>
      </a>
    </div>
  );
}
