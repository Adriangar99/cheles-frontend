import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TOTP } from "otpauth";

// Playwright loads these files as CommonJS
const COMPOSE_FILE = join(__dirname, "compose.yaml");
export const STATE_DIR = join(__dirname, ".state/");
export const USER = { username: "e2e", password: "contrasena-e2e-larga" };

export function compose(...args: string[]) {
  return execFileSync("docker", ["compose", "-f", COMPOSE_FILE, ...args], { encoding: "utf8" });
}

// The current 6-digit code of the e2e user's authenticator
export function totpCode() {
  const { secret } = JSON.parse(readFileSync(`${STATE_DIR}user.json`, "utf8"));
  return new TOTP({ secret }).generate();
}
