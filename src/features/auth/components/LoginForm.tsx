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
        {login.error && <Message kind="error">{login.error.message}</Message>}
        {/* Still disabled after success: the browser is already navigating to / */}
        <Button type="submit" variant="primary" disabled={login.isPending || login.isSuccess}>
          entrar
        </Button>
      </form>
    </div>
  );
}
