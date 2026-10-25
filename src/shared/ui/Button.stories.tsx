import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = { title: "Design system/Button", component: Button, args: { children: "Leer ahora" } } satisfies Meta<
  typeof Button
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary", children: "Conectar un banco" } };
export const Disabled: Story = { args: { disabled: true, children: "Leyendo…" } };
export const Quiet: Story = { args: { variant: "quiet", children: "Quitar" } };
export const Small: Story = { args: { size: "small", children: "⇄ Entre mis cuentas (quitar)" } };
