import { vi } from "vitest";

// jsdom cannot navigate, so screens see a plain location whose href records where they sent the browser; history
// replacements update it like a browser would.
export function stubLocation(path = "/") {
  const url = new URL(path, "http://localhost");
  const location = { href: url.href, search: url.search, pathname: url.pathname, origin: url.origin };
  vi.stubGlobal("location", location);
  vi.stubGlobal("history", {
    replaceState: (_state: unknown, _unused: string, to: string) => {
      const next = new URL(to, location.href);
      Object.assign(location, { href: next.href, search: next.search, pathname: next.pathname });
    },
  });
  return location;
}

// Freezes the clock (Date only; timers stay real so debounces still run).
export function today(iso: string) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(iso));
}
