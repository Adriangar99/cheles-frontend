import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = { title: "Design system/Button", component: Button, args: { children: "leer ahora" } } satisfies Meta<
  typeof Button
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary", children: "conectar un banco" } };
export const Disabled: Story = { args: { disabled: true, children: "leyendo…" } };
export const Quiet: Story = { args: { variant: "quiet", children: "quitar" } };
export const Small: Story = { args: { size: "small", children: "⇄ entre mis cuentas (quitar)" } };
