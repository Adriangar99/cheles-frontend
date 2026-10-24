import { useMutation } from "@tanstack/react-query";
import { useAuthApi } from "./provider";

// Both navigate with a full page load, so the middleware sees the new (or cleared) session cookie.
export function useLogin() {
  const api = useAuthApi();
  return useMutation({
    mutationFn: api.login,
    onSuccess: () => {
      window.location.href = "/";
    },
  });
}

export function useLogout() {
  const api = useAuthApi();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
}
