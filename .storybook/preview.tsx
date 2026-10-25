import type { Preview } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "../src/app/globals.css";
import { createQueryClient } from "../src/shared/query";

const preview: Preview = {
  // Light, dark, or whatever the system prefers (the app follows the system)
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "system", title: "Sistema" },
          { value: "light", title: "Claro" },
          { value: "dark", title: "Oscuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "system" },
  // Every story gets a fresh query cache, so screens load their fake data from scratch
  decorators: [
    (Story, { globals }) => {
      if (globals.theme === "system") delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = globals.theme;
      return <Story />;
    },
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
