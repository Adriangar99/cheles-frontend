import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stamp } from "./Stamp";

const meta = { title: "Design system/Stamp", component: Stamp } satisfies Meta<typeof Stamp>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = { args: { tone: "pos", children: "al día · 80 días de permiso" } };
export const NeedsAction: Story = { args: { tone: "neg", children: "Hay que reconectar" } };
export const Plain: Story = { args: { children: "Sin leer aún" } };
