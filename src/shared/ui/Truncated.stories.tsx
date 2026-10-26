import type { Meta, StoryObj } from "@storybook/react-vite";
import { Truncated } from "./Truncated";

const meta = {
  title: "Design system/Truncated",
  component: Truncated,
  decorators: [(Story) => <div style={{ width: 200 }}>{Story()}</div>],
} satisfies Meta<typeof Truncated>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fits: Story = { args: { text: "ACME FUEL" } };
export const Cut: Story = { args: { text: "PAGO CON TARJETA EN GASOLINERAS // PAGO CON TARJETA // ACME FUEL" } };
