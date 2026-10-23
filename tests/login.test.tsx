import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import LoginPage from "@/app/login/page";
import { fail, fakeApi, ok, pending } from "./fake-api";
import { stubLocation } from "./location";

async function submit(user = userEvent.setup()) {
  await user.type(screen.getByPlaceholderText("usuario"), "adrian");
  await user.type(screen.getByPlaceholderText("contraseña"), "secret");
  await user.type(screen.getByPlaceholderText("código de 6 dígitos"), "123456");
  await user.click(screen.getByRole("button", { name: "entrar" }));
}

test("Empty field", async () => {
  const api = fakeApi({ "POST /api/auth/login": ok({ ok: true }) });
  render(<LoginPage />);

  await userEvent.type(screen.getByPlaceholderText("usuario"), "adrian");
  await userEvent.click(screen.getByRole("button", { name: "entrar" }));

  expect(api.requests).toEqual([]);
});

test("Code autofill", () => {
  render(<LoginPage />);

  const code = screen.getByPlaceholderText("código de 6 dígitos");
  expect(code).toHaveAttribute("autocomplete", "one-time-code");
  expect(code).toHaveAttribute("inputmode", "numeric");
  expect(code).toHaveAttribute("maxlength", "6");
});

test("Correct credentials", async () => {
  const location = stubLocation("/login");
  const api = fakeApi({ "POST /api/auth/login": ok({ ok: true }) });
  render(<LoginPage />);

  await submit();

  expect(api.to("POST", "/api/auth/login")[0].body).toEqual({ username: "adrian", password: "secret", code: "123456" });
  expect(location.href).toBe("/");
});

test("Wrong credentials", async () => {
  stubLocation("/login");
  fakeApi({ "POST /api/auth/login": fail(401, { detail: "Datos incorrectos" }) });
  render(<LoginPage />);

  await submit();

  expect(await screen.findByText("Datos incorrectos")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "entrar" })).toBeEnabled();
});

test("Too many attempts", async () => {
  stubLocation("/login");
  fakeApi({ "POST /api/auth/login": fail(429, { detail: "Demasiados intentos, espera unos minutos" }) });
  render(<LoginPage />);

  await submit();

  expect(await screen.findByText("Demasiados intentos, espera unos minutos")).toBeInTheDocument();
});

test("Request in progress", async () => {
  stubLocation("/login");
  const reply = pending();
  fakeApi({ "POST /api/auth/login": reply.route });
  render(<LoginPage />);

  await submit();

  expect(screen.getByRole("button", { name: "entrar" })).toBeDisabled();
  reply.release(ok({ ok: true }));
});
