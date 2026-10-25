import { expect, test } from "@playwright/test";
import { logIn } from "./session";

const SCREENSHOTS = "e2e/screenshots";

// One journey on one stack: each step builds on the previous one (connected bank, roles, edits).
test("connecting a bank fills every screen, and removing it keeps the accounts", async ({ page }) => {
  await logIn(page);
  await page.screenshot({ path: `${SCREENSHOTS}/mi-mes-empty.png`, fullPage: true });

  await test.step("connect through the bank's authorization page", async () => {
    await page.goto("/bancos");
    await page.getByRole("button", { name: "conectar un banco" }).click();
    await page.getByRole("listitem", { name: "Banco E2E" }).getByRole("button", { name: "conectar" }).click();

    await expect(page.getByRole("status")).toHaveText("banco conectado ✓");
    await expect(page).toHaveURL("/bancos");
    const bank = page.getByRole("region", { name: "Banco E2E" });
    await expect(bank.getByRole("listitem", { name: "Cuenta Online" })).toContainText("1612,70");
    await expect(bank.getByRole("listitem", { name: "Ahorro" })).toContainText("5300,00");
  });

  await test.step("mark the savings account", async () => {
    const savings = page.getByRole("listitem", { name: "Ahorro" });
    await savings.getByRole("combobox", { name: "para qué es esta cuenta" }).selectOption({ label: "ahorro" });
    await expect(savings.getByRole("combobox")).toHaveValue("savings");
    await page.screenshot({ path: `${SCREENSHOTS}/bancos.png`, fullPage: true });
  });

  await test.step("«mi mes» counts the month, without the transfer to savings", async () => {
    await page.goto("/");
    const figure = (label: string) => page.locator("dt", { hasText: label }).locator("+ dd");
    await expect(figure("ingresos")).toHaveText("2000,00 €");
    await expect(figure("gastos")).toHaveText("87,30 €");
    await expect(figure("enviado a ahorro")).toHaveText("300,00 €");
    await expect(figure("saldo total ahora")).toHaveText("6912,70 €");
    await page.screenshot({ path: `${SCREENSHOTS}/mi-mes.png`, fullPage: true });
  });

  await test.step("«movimientos» lists them, and a category change is kept", async () => {
    await page.goto("/movimientos");
    await expect(page.getByRole("heading", { name: "5 movimientos" })).toBeVisible();
    const groceries = page.getByRole("listitem", { name: "MERCADONA" });
    await groceries.getByRole("combobox", { name: "categoría" }).selectOption({ label: "🍽 Restaurantes" });

    await page.reload();
    await expect(
      page.getByRole("listitem", { name: "MERCADONA" }).getByRole("combobox", { name: "categoría" }),
    ).toHaveText(/Restaurantes/);
    await page.screenshot({ path: `${SCREENSHOTS}/movimientos.png`, fullPage: true });
  });

  await test.step("removing the connection keeps its accounts", async () => {
    await page.goto("/bancos");
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("region", { name: "Banco E2E" }).getByRole("button", { name: "quitar" }).click();

    const detached = page.getByRole("region", { name: "cuentas sin banco" });
    await expect(detached.getByRole("listitem", { name: "Cuenta Online" })).toBeVisible();
    await expect(detached.getByRole("listitem", { name: "Ahorro" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Banco E2E" })).toHaveCount(0);
  });
});
