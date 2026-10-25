import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { AuthApiProvider, fakeAuthApi } from "@/features/auth";
import { fakeImportsApi, ImportsApiProvider } from "@/features/imports";
import type { BanksApi } from "../api";
import { fakeBanksApi } from "../fake";
import { BanksApiProvider } from "../provider";
import { BanksScreen } from "./BanksScreen";

// «salir» uses the auth feature and «importar movimientos» the imports one, so their ports are provided too
const withApi =
  (api: BanksApi): Decorator =>
  (Story) => (
    <AuthApiProvider adapter={fakeAuthApi()}>
      <BanksApiProvider adapter={api}>
        <ImportsApiProvider adapter={fakeImportsApi()}>
          <Story />
        </ImportsApiProvider>
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
