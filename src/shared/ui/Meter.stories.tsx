import type { Meta, StoryObj } from "@storybook/react-vite";
import { Meter } from "./Meter";

const meta = {
  title: "Design system/Meter",
  component: Meter,
  args: { label: "🛒 Supermercado", value: 40, max: 100, color: "#4caf50" },
} satisfies Meta<typeof Meter>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Full: Story = { args: { value: 100 } };
export const Vertical: Story = {
  args: { orientation: "vertical", label: "2026-10 ingresos", value: 50, max: 70, color: "var(--color-positive)" },
  render: (args) => (
    <div className="card history">
      <div className="col">
        <Meter {...args} />
      </div>
    </div>
  ),
};
