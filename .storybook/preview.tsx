import type { Preview } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import "../src/app/globals.css";
import { createQueryClient } from "../src/shared/query";

const preview: Preview = {
  // Every story gets a fresh query cache, so screens load their fake data from scratch
  decorators: [
    (Story) => (
      <QueryClientProvider client={createQueryClient()}>
        <main>
          <Story />
        </main>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },
};

export default preview;
