import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type { StatsApi } from "../api";
import { fakeStatsApi } from "../fake";
import { StatsApiProvider } from "../provider";
import { MyMonthScreen } from "./MyMonthScreen";

const withApi =
  (api: StatsApi): Decorator =>
  (Story) => (
    <StatsApiProvider adapter={api}>
      <Story />
    </StatsApiProvider>
  );

const meta = { title: "Screens/Mi mes", component: MyMonthScreen } satisfies Meta<typeof MyMonthScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = { decorators: [withApi(fakeStatsApi())] };
export const OtherCurrencies: Story = {
  decorators: [withApi(fakeStatsApi("loaded", { other_currencies: ["USD"], net: -150 }))],
};
export const Empty: Story = { decorators: [withApi(fakeStatsApi("empty"))] };
export const Loading: Story = { decorators: [withApi(fakeStatsApi("loading"))] };
export const Failed: Story = { decorators: [withApi(fakeStatsApi("error"))] };
