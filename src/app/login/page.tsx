"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("/auth/login", {
        method: "POST",
        json: { username: form.get("username"), password: form.get("password"), code: form.get("code") },
      });
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <form onSubmit={submit}>
        <h1>cheles</h1>
        <p className="sub">entra para ver tus cuentas</p>
        <input name="username" placeholder="usuario" autoComplete="username" autoCapitalize="none" required />
        <input name="password" type="password" placeholder="contraseña" autoComplete="current-password" required />
        <input
          name="code"
          inputMode="numeric"
          placeholder="código de 6 dígitos"
          autoComplete="one-time-code"
          maxLength={6}
          required
        />
        {error && <p className="err">{error}</p>}
        <button className="btn primary" disabled={busy}>
          entrar
        </button>
      </form>
    </div>
  );
}
