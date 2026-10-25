import { api, call } from "@/shared/api/client";
import type { components } from "@/shared/api/schema";

type Schemas = components["schemas"];

export type Banks = Schemas["BanksOut"];
export type Connection = Schemas["ConnectionOut"];
export type Account = Schemas["AccountOut"];
export type AvailableBank = Schemas["AvailableBankOut"];
export type Role = Account["role"];

export interface BanksApi {
  list(): Promise<Banks>;
  available(): Promise<AvailableBank[]>;
  // Returns the bank's authorization page
  connect(bank: { name: string; country: string }): Promise<string>;
  sync(connectionId: number): Promise<void>;
  reprocess(): Promise<void>;
  setRole(accountId: number, role: Role): Promise<void>;
}

export const httpBanksApi: BanksApi = {
  list: () => call(api().GET("/api/banks")),
  available: () => call(api().GET("/api/banks/available")),
  async connect(bank) {
    const { url } = await call(api().POST("/api/banks/connect", { body: bank }));
    return url;
  },
  async sync(connectionId) {
    await call(api().POST("/api/banks/{connection_id}/sync", { params: { path: { connection_id: connectionId } } }));
  },
  async reprocess() {
    await call(api().POST("/api/reprocess"));
  },
  async setRole(accountId, role) {
    await call(
      api().PATCH("/api/accounts/{account_id}", { params: { path: { account_id: accountId } }, body: { role } }),
    );
  },
};
