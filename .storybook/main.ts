import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import react from "@vitejs/plugin-react";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/react-vite", options: {} },
  // The same import aliases as the app; the React plugin compiles JSX (tsconfig keeps it for Next.js: "preserve")
  viteFinal: (vite) => ({
    ...vite,
    plugins: [...(vite.plugins ?? []), react()],
    resolve: {
      ...vite.resolve,
      alias: { ...vite.resolve?.alias, "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
  }),
};

export default config;
