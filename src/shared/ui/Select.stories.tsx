import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Design system/Select",
  component: Select,
  args: {
    label: "Para qué es esta cuenta",
    defaultValue: "savings",
    children: [
      <option key="main" value="main">
        Día a día
      </option>,
      <option key="savings" value="savings">
        Ahorro
      </option>,
      <option key="excluded" value="excluded">
        No cuenta
      </option>,
    ],
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Role: Story = {};
