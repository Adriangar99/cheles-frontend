import { expect, type Page } from "@playwright/test";
import { totpCode, USER } from "./stack";

// Logs in through the form, as the user does
export async function logIn(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("usuario").fill(USER.username);
  await page.getByPlaceholder("contraseña").fill(USER.password);
  await page.getByPlaceholder("código de 6 dígitos").fill(totpCode());
  await page.getByRole("button", { name: "entrar" }).click();
  await expect(page).toHaveURL("/");
}
