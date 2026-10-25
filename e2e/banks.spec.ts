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
    // The last read time changes on every run: masked so screenshots compare across runs
    await page.screenshot({
      path: `${SCREENSHOTS}/bancos.png`,
      fullPage: true,
      mask: [page.getByText(/^leído el /)],
    });
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

  await test.step("importing a MoneyLover export fills the previous month", async () => {
    // Invented export, UTF-16 like MoneyLover writes it, dated in the month before the current one
    const now = new Date();
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 10);
    const day = `10/${String(previous.getMonth() + 1).padStart(2, "0")}/${previous.getFullYear()}`;
    const csv = [
      "Id,Fecha,Categoria,Cantidad,Moneda,Nota,Cuenta",
      `1,${day},Salario,1500.00,EUR,Nómina,Cartera E2E`,
      `2,${day},Comida y bebida,-45.20,EUR,Mercado,Cartera E2E`,
      `3,${day},Gasolina,-12.00,EUR,,Cartera E2E`,
      `4,${day},Otros gastos,-5.00,EUR,Ajuste,Cartera E2E`,
    ].join("\r\n");
    const utf16 = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(csv, "utf16le")]);

    await page
      .getByLabel("elegir fichero CSV")
      .setInputFiles({ name: "moneylover.csv", mimeType: "text/csv", buffer: utf16 });
    const wallet = page.getByRole("listitem", { name: "Cartera E2E" });
    await expect(wallet).toContainText("entran 3");
    await expect(wallet).toContainText("1 ajustes de saldo no se importan");
    await page.getByRole("button", { name: "importar 3 movimientos" }).click();
    await expect(page.getByRole("status")).toHaveText("3 movimientos importados ✓");
    await expect(
      page.getByRole("region", { name: "cuentas sin banco" }).getByRole("listitem", { name: "Cartera E2E" }),
    ).toBeVisible();

    await page.goto("/");
    await page.getByRole("button", { name: "mes anterior" }).click();
    const figure = (label: string) => page.locator("dt", { hasText: label }).locator("+ dd").first();
    await expect(figure("ingresos")).toHaveText("1500,00 €");
    await expect(figure("gastos")).toHaveText("57,20 €");
  });
});
