import type { ImportPreview, Target, Targets } from "../api";

// A file's bytes as base64, in chunks so a large file does not overflow the call stack
export function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

// Until the user chooses, every wallet of the file goes to a new account
export const everyWalletToNew = (preview: ImportPreview): Targets =>
  Object.fromEntries(preview.wallets.map((w) => [w.name, "new" as const]));

export const totalToImport = (preview: ImportPreview) => preview.wallets.reduce((sum, w) => sum + w.to_import, 0);

// The selector's value for a target, and back
export const targetValue = (target: Target) => (target === null ? "none" : String(target));
export const parseTarget = (value: string): Target =>
  value === "none" ? null : value === "new" ? "new" : Number(value);
