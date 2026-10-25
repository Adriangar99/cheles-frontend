import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { compose, STATE_DIR, USER } from "./stack";

// Builds and starts the throwaway stack, then creates the user with the API's own use case.
export default function globalSetup() {
  mkdirSync(STATE_DIR, { recursive: true });
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });
  writeFileSync(`${STATE_DIR}eb_private_key.pem`, privateKey, { mode: 0o600 });

  compose("up", "-d", "--build", "--wait");
  const secret = compose(
    "exec",
    "-T",
    "api",
    "python",
    "-c",
    `from app import bootstrap; print(bootstrap.Container.from_environment().identity().create_user(${JSON.stringify(
      USER.username,
    )}, ${JSON.stringify(USER.password)}).secret)`,
  )
    .trim()
    .split("\n")
    .at(-1);
  writeFileSync(`${STATE_DIR}user.json`, JSON.stringify({ secret }));
}
