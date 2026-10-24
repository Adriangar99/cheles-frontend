import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Providers } from "@/app/providers";

// Screens render inside the app's real providers (HTTP adapters, a fresh query cache per render).
export const renderScreen = (ui: ReactElement) => render(<Providers>{ui}</Providers>);
