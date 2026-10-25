"use client";

import { Button, Message } from "@/shared/ui";
import { useLogin } from "../hooks";

export function LoginForm() {
  const login = useLogin();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    login.mutate({
      username: String(form.get("username")),
      password: String(form.get("password")),
      code: String(form.get("code")),
    });
  }

  return (
    <div className="login">
      <div className="cover">
        <header className="cover-title">
          <h1>Cheles</h1>
          <p>Entra para ver tus cuentas</p>
        </header>
        <form className="card" onSubmit={submit}>
          <input name="username" placeholder="Usuario" autoComplete="username" autoCapitalize="none" required />
          <input name="password" type="password" placeholder="Contraseña" autoComplete="current-password" required />
          <input
            name="code"
            inputMode="numeric"
            placeholder="Código de 6 dígitos"
            autoComplete="one-time-code"
            maxLength={6}
            required
          />
          {login.error && <Message kind="error">{login.error.message}</Message>}
          {/* Still disabled after success: the browser is already navigating to / */}
          <Button type="submit" variant="primary" disabled={login.isPending || login.isSuccess}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
