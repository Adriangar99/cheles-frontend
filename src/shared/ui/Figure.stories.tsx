import type { Meta, StoryObj } from "@storybook/react-vite";
import { Figure, Figures } from "./Figure";

const meta = { title: "Design system/Figure", component: Figures } satisfies Meta<typeof Figures>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  args: { children: null },
  render: () => (
    <Figures>
      <Figure label="Ingresos" value="2000,00 €" tone="pos" />
      <Figure label="Gastos" value="1200,00 €" />
      <Figure label="Sobra" value="-150,00 €" tone="neg" />
      <Figure label="Enviado a ahorro" value="300,00 €" />
      <Figure label="Saldo total ahora" value="6912,70 €" total>
        <dd className="sub">día a día 1612,70 € · ahorro 5300,00 €</dd>
      </Figure>
    </Figures>
  ),
};
