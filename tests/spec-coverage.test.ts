import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

// Scenarios that depend on the built image or the port binding; checked against the running containers.
const VERIFIED_IN_DOCKER: Record<string, string[]> = {
  "api-access": ["API URL fixed at build time", "Proxied API response", "Access from another device"],
};

const dirs = (path: string) =>
  readdirSync(path, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

const scenarios = (file: string) =>
  [...readFileSync(file, "utf8").matchAll(/^#### Scenario: (.+)$/gm)].map((m) => m[1].trim());

function requiredScenarios(): Map<string, string[]> {
  const required = new Map<string, string[]>();
  for (const capability of dirs("openspec/specs")) {
    required.set(capability, scenarios(join("openspec/specs", capability, "spec.md")));
  }
  for (const change of dirs("openspec/changes").filter((c) => c !== "archive")) {
    const specs = join("openspec/changes", change, "specs");
    if (!existsSync(specs)) continue;
    for (const capability of dirs(specs)) {
      const known = required.get(capability) ?? [];
      const added = scenarios(join(specs, capability, "spec.md")).filter((s) => !known.includes(s));
      required.set(capability, [...known, ...added]);
    }
  }
  return required;
}

test("every spec scenario has a characterization test", () => {
  const missing: string[] = [];
  for (const [capability, titles] of requiredScenarios()) {
    const file = join("tests", `${capability}.test.tsx`);
    const source = existsSync(file) ? readFileSync(file, "utf8") : "";
    const tested = [...source.matchAll(/\btest\(\s*"([^"]+)"/g)].map((m) => m[1]);
    const exempt = VERIFIED_IN_DOCKER[capability] ?? [];
    for (const title of new Set(titles.filter((t) => !exempt.includes(t)))) {
      const shortfall = titles.filter((t) => t === title).length - tested.filter((t) => t === title).length;
      if (shortfall > 0) missing.push(`${capability}: ${title}`);
    }
  }
  expect(missing).toEqual([]);
});
