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
      // The typed client sends a Request; plain fetch(url, init) calls are accepted too
      const request = input instanceof Request ? input : new Request(new URL(String(input), "http://localhost"), init);
      const url = new URL(request.url);
      const text = await request.text();
      const req = {
        method: request.method,
        path: url.pathname,
        query: url.searchParams,
        body: text ? JSON.parse(text) : undefined,
        headers: request.headers,
      };
      requests.push(req);
      const route = routes[`${req.method} ${url.pathname}`];
      if (!route) throw new Error(`Unexpected request: ${req.method} ${url.pathname}${url.search}`);
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
