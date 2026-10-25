import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { AuthApiProvider, fakeAuthApi } from "@/features/auth";
import type { BanksApi } from "../api";
import { fakeBanksApi } from "../fake";
import { BanksApiProvider } from "../provider";
import { BanksScreen } from "./BanksScreen";

// «salir» uses the auth feature, so its port is provided too
const withApi =
  (api: BanksApi): Decorator =>
  (Story) => (
    <AuthApiProvider adapter={fakeAuthApi()}>
      <BanksApiProvider adapter={api}>
        <Story />
      </BanksApiProvider>
    </AuthApiProvider>
  );

const meta = { title: "Screens/Bancos", component: BanksScreen } satisfies Meta<typeof BanksScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = { decorators: [withApi(fakeBanksApi())] };
export const Empty: Story = { decorators: [withApi(fakeBanksApi("empty"))] };
export const Loading: Story = { decorators: [withApi(fakeBanksApi("loading"))] };
export const Failed: Story = { decorators: [withApi(fakeBanksApi("error"))] };
