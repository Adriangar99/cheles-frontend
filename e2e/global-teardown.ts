import { rmSync } from "node:fs";
import { compose, STATE_DIR } from "./stack";

// E2E_KEEP=1 leaves the stack running to debug it (`docker compose -f e2e/compose.yaml down -v` afterwards)
export default function globalTeardown() {
  if (process.env.E2E_KEEP) return;
  compose("down", "-v", "--remove-orphans");
  rmSync(STATE_DIR, { recursive: true, force: true });
}
