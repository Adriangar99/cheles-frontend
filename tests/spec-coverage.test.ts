import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

// Scenarios that need a second device on the network; checked by hand against the running containers.
const VERIFIED_BY_HAND: Record<string, string[]> = {
  "api-access": ["Access from another device"],
};

// A scenario is covered by a characterization test (tests/<capability>.test.tsx) or an end-to-end test
// (e2e/<capability>.spec.ts) named after it.
const testNames = (file: string) =>
  existsSync(file) ? [...readFileSync(file, "utf8").matchAll(/\btest\(\s*"([^"]+)"/g)].map((m) => m[1]) : [];

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
    const tested = [
      ...testNames(join("tests", `${capability}.test.tsx`)),
      ...testNames(join("e2e", `${capability}.spec.ts`)),
    ];
    const exempt = VERIFIED_BY_HAND[capability] ?? [];
    for (const title of new Set(titles.filter((t) => !exempt.includes(t)))) {
      const shortfall = titles.filter((t) => t === title).length - tested.filter((t) => t === title).length;
      if (shortfall > 0) missing.push(`${capability}: ${title}`);
    }
  }
  expect(missing).toEqual([]);
});
