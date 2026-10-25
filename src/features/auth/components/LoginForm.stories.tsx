import type { Meta, StoryObj } from "@storybook/react-vite";
import { fakeAuthApi } from "../fake";
import { AuthApiProvider } from "../provider";
import { LoginForm } from "./LoginForm";

// Any code but 123456 shows the API's message
const meta = {
  title: "Screens/Login",
  component: LoginForm,
  decorators: [
    (Story) => (
      <AuthApiProvider adapter={fakeAuthApi()}>
        <Story />
      </AuthApiProvider>
    ),
  ],
} satisfies Meta<typeof LoginForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Form: Story = {};
