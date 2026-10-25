import createClient, { type Client } from "openapi-fetch";
import type { paths } from "./schema";

// Thrown after redirecting a 401 to /login; screens do not show it, the browser is already leaving
const UNAUTHENTICATED = "No autenticado";

let client: Client<paths> | undefined;

// The typed client for the same-origin API (proxied by the /api/* rewrite), created on first use so it takes the
// page's origin and the current fetch.
export function api() {
  client ??= createClient<paths>({
    baseUrl: window.location.origin,
    fetch: (request) => globalThis.fetch(request),
  });
  return client;
}

type Result<T> = { data?: T; error?: unknown; response: Response };

// The response data, or a thrown Error with the API's `detail` (or «Error <status>»). A 401 sends the browser to
// /login unless the call itself is the login.
export async function call<T>(pending: Promise<Result<T>>, { redirectOn401 = true } = {}): Promise<T> {
  const { data, error, response } = await pending;
  if (response.status === 401 && redirectOn401) {
    window.location.href = "/login";
    throw new Error(UNAUTHENTICATED);
  }
  if (!response.ok || data === undefined) {
    const detail = error && typeof error === "object" && "detail" in error ? error.detail : undefined;
    throw new Error(detail === undefined ? `Error ${response.status}` : String(detail));
  }
  return data;
}

// The message to show for the first failure, if any (a 401 is not shown: the browser is going to /login).
export function errorMessage(...errors: (Error | null | undefined)[]) {
  return errors.find((e) => e && e.message !== UNAUTHENTICATED)?.message ?? null;
}
