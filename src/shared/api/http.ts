export type RequestOptions = RequestInit & { json?: unknown };

// Same-origin request to the API (proxied by the /api/* rewrite). A 401 outside the login sends the browser to
// /login; any other failure throws the API's `detail`, or «Error <status>».
export async function request<T = unknown>(path: string, init?: RequestOptions): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: init?.json ? { "Content-Type": "application/json" } : undefined,
    body: init?.json ? JSON.stringify(init.json) : init?.body,
  });
  if (res.status === 401 && !path.startsWith("/auth/login")) {
    window.location.href = "/login";
    throw new Error("No autenticado");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? `Error ${res.status}`);
  }
  return res.json();
}
