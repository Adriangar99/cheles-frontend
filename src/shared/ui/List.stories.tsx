import type { Meta, StoryObj } from "@storybook/react-vite";
import { Amount } from "./Amount";
import { Button } from "./Button";
import { Card } from "./Card";
import { List, ListItem } from "./List";

const meta = { title: "Design system/List", component: List } satisfies Meta<typeof List>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Rows: Story = {
  render: () => (
    <List>
      <ListItem aria-label="MERCADONA">
        <div className="grow">MERCADONA</div>
        <Amount as="div" value={-62.4} />
      </ListItem>
      <ListItem aria-label="EMPRESA SL">
        <div className="grow">EMPRESA SL</div>
        <Amount as="div" value={2000} tone="pos" />
      </ListItem>
    </List>
  ),
};

export const Empty: Story = {
  render: () => (
    <List>
      <ListItem muted>Nada por aquí</ListItem>
    </List>
  ),
};

export const PlainCard: Story = {
  render: () => (
    <Card>
      <div className="row">
        <div className="grow">Reprocesar desde los bancos</div>
        <Button>Hazlo ahora</Button>
      </div>
    </Card>
  ),
};
