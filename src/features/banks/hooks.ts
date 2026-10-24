import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Role } from "./api";
import { useBanksApi } from "./provider";

const BANKS_KEY = ["banks"];

export function useBanks() {
  const api = useBanksApi();
  return useQuery({ queryKey: BANKS_KEY, queryFn: () => api.list() });
}

// Fetched only when the user asks for the list.
export function useAvailableBanks() {
  const api = useBanksApi();
  return useMutation({ mutationFn: () => api.available() });
}

// Sends the browser to the bank's authorization page.
export function useConnectBank() {
  const api = useBanksApi();
  return useMutation({
    mutationFn: api.connect,
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}

// Actions stay pending until the screen's data has been reloaded.
function useBanksAction<T>(action: (variables: T) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BANKS_KEY }),
  });
}

export function useSyncConnection() {
  const api = useBanksApi();
  return useBanksAction((connectionId: number) => api.sync(connectionId));
}

export function useReprocess() {
  const api = useBanksApi();
  return useBanksAction(() => api.reprocess());
}

export function useSetRole() {
  const api = useBanksApi();
  return useBanksAction(({ accountId, role }: { accountId: number; role: Role }) => api.setRole(accountId, role));
}
