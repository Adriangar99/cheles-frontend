import { api, call } from "@/shared/api/client";
import type { components } from "@/shared/api/schema";

type Schemas = components["schemas"];

export type ImportPreview = Schemas["ImportPreviewOut"];
export type WalletPreview = Schemas["ImportWalletOut"];
export type ImportResult = Schemas["ImportResultOut"];
// Where each MoneyLover wallet goes: an existing account's id, a new account, or nowhere
export type Targets = Schemas["ImportIn"]["accounts"];
export type Target = Targets[string];
// The CSV file as base64, as the API takes it
export type ImportRequest = { file: string; accounts: Targets };

export interface ImportsApi {
  preview(request: ImportRequest): Promise<ImportPreview>;
  run(request: ImportRequest): Promise<ImportResult>;
}

export const httpImportsApi: ImportsApi = {
  preview: (body) => call(api().POST("/api/imports/preview", { body })),
  run: (body) => call(api().POST("/api/imports", { body })),
};
