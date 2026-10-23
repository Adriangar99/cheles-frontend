import { vi } from "vitest";

// jsdom cannot navigate, so screens see a plain location whose href records where they sent the browser.
export function stubLocation(path = "/") {
  const url = new URL(path, "http://localhost");
  const location = { href: url.href, search: url.search, pathname: url.pathname };
  vi.stubGlobal("location", location);
  return location;
}

// Freezes the clock (Date only; timers stay real so debounces still run).
export function today(iso: string) {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(iso));
}
