import { expect, test } from "@playwright/test";
import { logIn } from "./session";
import { USER } from "./stack";

test("a wrong code keeps the user on the login with the API's message", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("Usuario").fill(USER.username);
  await page.getByPlaceholder("Contraseña").fill(USER.password);
  await page.getByPlaceholder("Código de 6 dígitos").fill("000000");
  await page.getByRole("button", { name: "Entrar" }).click();

  // Next.js adds its own (empty) route announcer alert, so the message is found by its text
  await expect(page.getByRole("alert").filter({ hasText: "Datos incorrectos" })).toBeVisible();
  await expect(page).toHaveURL("/login");
});

test("without a session every screen sends the browser to the login", async ({ page }) => {
  for (const path of ["/", "/movimientos", "/bancos"]) {
    await page.goto(path);
    await expect(page).toHaveURL("/login");
  }
});

test("logging in opens «mi mes» and logging out closes the session", async ({ page }) => {
  await logIn(page);
  await expect(page.getByRole("navigation", { name: "mes" })).toBeVisible();

  await page.goto("/bancos");
  await page.getByRole("button", { name: "Salir" }).click();

  await expect(page).toHaveURL("/login");
  await page.goto("/movimientos");
  await expect(page).toHaveURL("/login");
});
