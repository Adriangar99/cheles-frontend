import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message } from "./Message";

const meta = { title: "Design system/Message", component: Message } satisfies Meta<typeof Message>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorMessage: Story = { name: "Error", args: { kind: "error", children: "Datos incorrectos" } };
export const Status: Story = { args: { kind: "status", children: "Banco conectado ✓" } };
export const Note: Story = { args: { kind: "note", children: "No se cuentan importes en USD" } };
