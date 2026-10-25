import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type { TransactionsApi } from "../api";
import { fakeTransactionsApi } from "../fake";
import { TransactionsApiProvider } from "../provider";
import { TransactionsScreen } from "./TransactionsScreen";

const withApi =
  (api: TransactionsApi): Decorator =>
  (Story) => (
    <TransactionsApiProvider adapter={api}>
      <Story />
    </TransactionsApiProvider>
  );

const meta = { title: "Screens/Movimientos", component: TransactionsScreen } satisfies Meta<typeof TransactionsScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = { decorators: [withApi(fakeTransactionsApi())] };
export const Empty: Story = { decorators: [withApi(fakeTransactionsApi("empty"))] };
export const Loading: Story = { decorators: [withApi(fakeTransactionsApi("loading"))] };
export const Failed: Story = { decorators: [withApi(fakeTransactionsApi("error"))] };
