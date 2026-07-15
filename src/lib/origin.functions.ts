import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export function getCanonicalOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = url.hostname.replace(/^www\./i, "");
  const isLocalHost = host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
  const protocol = isLocalHost ? url.protocol : "https:";
  const port = isLocalHost && url.port ? `:${url.port}` : "";
  return `${protocol}//${host}${port}`;
}

export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  const req = getRequest();
  return getCanonicalOrigin(req);
});
