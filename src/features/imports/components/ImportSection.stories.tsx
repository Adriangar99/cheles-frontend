import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import type { ImportsApi } from "../api";
import { fakeImportsApi } from "../fake";
import { ImportsApiProvider } from "../provider";
import { ImportSection } from "./ImportSection";

const withApi =
  (api: ImportsApi): Decorator =>
  (Story) => (
    <ImportsApiProvider adapter={api}>
      <Story />
    </ImportsApiProvider>
  );

// Choosing a file the way the user does; the fake API answers for any content
const chooseFile = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await userEvent.upload(canvas.getByLabelText("elegir fichero CSV"), new File(["Id"], "moneylover.csv"));
};

const meta = {
  title: "Screens/Bancos/Importar movimientos",
  component: ImportSection,
  args: { accounts: [{ id: 1, name: "Nómina" }] },
} satisfies Meta<typeof ImportSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ChooseFile: Story = { decorators: [withApi(fakeImportsApi())] };

export const Preview: Story = { decorators: [withApi(fakeImportsApi())], play: chooseFile };

export const OntoABankAccount: Story = {
  decorators: [withApi(fakeImportsApi())],
  play: async (context) => {
    await chooseFile(context);
    const canvas = within(context.canvasElement);
    const principal = await canvas.findByRole("listitem", { name: "Cuenta Principal" });
    await userEvent.selectOptions(within(principal).getByRole("combobox", { name: "dónde van" }), "Nómina");
    await expect(await within(principal).findByText(/ya los trajo el banco/)).toBeInTheDocument();
  },
};

export const NothingToImport: Story = {
  decorators: [withApi(fakeImportsApi())],
  play: async (context) => {
    await chooseFile(context);
    const canvas = within(context.canvasElement);
    for (const name of ["Cuenta Principal", "Revolut"]) {
      const wallet = await canvas.findByRole("listitem", { name });
      await userEvent.selectOptions(within(wallet).getByRole("combobox", { name: "dónde van" }), "no importar");
    }
  },
};

export const UnrecognizedFile: Story = { decorators: [withApi(fakeImportsApi("error"))], play: chooseFile };
