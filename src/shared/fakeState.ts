// How a fake adapter answers: with its data, with nothing, never (still loading) or with an error.
export type FakeState = "loaded" | "empty" | "loading" | "error";

// Resolves `data` (or `empty`) after a short delay, never resolves, or rejects, depending on the state
export function answer<T>(state: FakeState, data: T, empty: T): Promise<T> {
  if (state === "loading") return new Promise<T>(() => {});
  if (state === "error") return Promise.reject(new Error("Error 500"));
  return new Promise((resolve) => setTimeout(() => resolve(state === "empty" ? empty : data), 150));
}
