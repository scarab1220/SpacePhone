import { createFileRoute } from "@tanstack/react-router";
import { getCanonicalOrigin } from "@/lib/origin.functions";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = getCanonicalOrigin(request);
        const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
