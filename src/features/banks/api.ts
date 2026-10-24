import { request } from "@/shared/api/http";
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
  list: () => request("/banks"),
  available: () => request("/banks/available"),
  async connect(bank) {
    const { url } = await request<Schemas["AuthorizationUrlOut"]>("/banks/connect", { method: "POST", json: bank });
    return url;
  },
  async sync(connectionId) {
    await request(`/banks/${connectionId}/sync`, { method: "POST" });
  },
  async reprocess() {
    await request("/reprocess", { method: "POST" });
  },
  async setRole(accountId, role) {
    await request(`/accounts/${accountId}`, { method: "PATCH", json: { role } });
  },
};
