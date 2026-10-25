import { expect, type Page } from "@playwright/test";
import { totpCode, USER } from "./stack";

// Logs in through the form, as the user does
export async function logIn(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("Usuario").fill(USER.username);
  await page.getByPlaceholder("Contraseña").fill(USER.password);
  await page.getByPlaceholder("Código de 6 dígitos").fill(totpCode());
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL("/");
}
