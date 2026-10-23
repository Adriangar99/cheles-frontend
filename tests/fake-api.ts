import { vi } from "vitest";

export type ApiRequest = { method: string; path: string; query: URLSearchParams; body: unknown; headers: Headers };
export type Reply = { status: number; body?: unknown };
type Route = Reply | ((req: ApiRequest) => Reply | Promise<Reply>);

export const ok = (body: unknown): Reply => ({ status: 200, body });
export const fail = (status: number, body?: unknown): Reply => ({ status, body });

// Stubs fetch with routes keyed by "METHOD /api/path" (no query); every request is recorded.
export function fakeApi(routes: Record<string, Route>) {
  const requests: ApiRequest[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input), "http://localhost");
      const method = init?.method ?? "GET";
      const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
      const req = { method, path: url.pathname, query: url.searchParams, body, headers: new Headers(init?.headers) };
      requests.push(req);
      const route = routes[`${method} ${url.pathname}`];
      if (!route) throw new Error(`Unexpected request: ${method} ${url.pathname}${url.search}`);
      const reply = typeof route === "function" ? await route(req) : route;
      return new Response(reply.body === undefined ? null : JSON.stringify(reply.body), { status: reply.status });
    }),
  );
  return {
    requests,
    to: (method: string, path: string) => requests.filter((r) => r.method === method && r.path === path),
  };
}

// A reply the test releases when it wants, to observe in-progress states.
export function pending() {
  let release: (reply: Reply) => void = () => {};
  const reply = new Promise<Reply>((resolve) => {
    release = resolve;
  });
  return { route: () => reply, release };
}
