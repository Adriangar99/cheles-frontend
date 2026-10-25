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

// Throws for a failed response: a 401 sends the browser to /login (unless the call is the login itself); any other
// failure throws the API's `detail`, or «Error <status>».
function throwIfFailed(response: Response, error: unknown, redirectOn401: boolean) {
  if (response.status === 401 && redirectOn401) {
    window.location.href = "/login";
    throw new Error(UNAUTHENTICATED);
  }
  if (!response.ok) {
    const detail = error && typeof error === "object" && "detail" in error ? error.detail : undefined;
    // A validation error's detail is a list of field errors, not a message for the user
    throw new Error(
      typeof detail === "string" ? detail : Array.isArray(detail) ? "Datos no válidos" : `Error ${response.status}`,
    );
  }
}

// The response data of a successful call.
export async function call<T>(pending: Promise<Result<T>>, { redirectOn401 = true } = {}): Promise<T> {
  const { data, error, response } = await pending;
  throwIfFailed(response, error, redirectOn401);
  if (data === undefined) throw new Error(`Error ${response.status}`);
  return data;
}

// For calls that answer without a body (204): only failures matter.
export async function callNoContent(pending: Promise<Result<unknown>>): Promise<void> {
  const { error, response } = await pending;
  throwIfFailed(response, error, true);
}

// The message to show for the first failure, if any (a 401 is not shown: the browser is going to /login).
export function errorMessage(...errors: (Error | null | undefined)[]) {
  return errors.find((e) => e && e.message !== UNAUTHENTICATED)?.message ?? null;
}
