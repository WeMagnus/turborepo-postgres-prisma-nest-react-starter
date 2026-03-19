import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CounterResponse } from "@repo/contracts";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  decrementCounter,
  fetchCounter,
  incrementCounter,
  resetCounter,
} from "./api/counter";
import "./App.css";

const counterQueryKey = ["counter"] as const;
type CounterAction = "decrement" | "increment" | "reset";

const counterActions: Record<CounterAction, () => Promise<CounterResponse>> = {
  decrement: decrementCounter,
  increment: incrementCounter,
  reset: resetCounter,
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error.";
}

function App() {
  const queryClient = useQueryClient();

  const counterQuery = useQuery({
    queryKey: counterQueryKey,
    queryFn: ({ signal }) => fetchCounter(signal),
  });

  const counterMutation = useMutation({
    mutationFn: (action: CounterAction) => counterActions[action](),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: counterQueryKey });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(counterQueryKey, data);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: counterQueryKey });
    },
  });

  const hasCounterValue = counterQuery.data !== undefined;
  const isInitialLoad = counterQuery.isLoading && !hasCounterValue;
  const isBusy = isInitialLoad || counterMutation.isPending;
  const value = counterQuery.data?.value;
  const errorMessage = counterMutation.error
    ? toErrorMessage(counterMutation.error)
    : !hasCounterValue && counterQuery.error
      ? toErrorMessage(counterQuery.error)
      : null;
  const statusMessage = isInitialLoad
    ? "Loading current value from API..."
    : counterMutation.isPending
      ? "Saving..."
      : !hasCounterValue
        ? "Unable to load counter value."
        : counterQuery.isFetching
          ? "Refreshing current value..."
          : "Counter value is persisted in Postgres.";

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>API + DB Counter</h1>
      <div className="card">
        <div className="counter-panel">
          <div className="button-row">
            <output className="counter-value" aria-live="polite">
              {value ?? "--"}
            </output>
            <button
              disabled={isBusy}
              onClick={() => counterMutation.mutate("reset")}
            >
              Reset
            </button>
          </div>

          <div className="button-row">
            <button
              disabled={isBusy}
              onClick={() => counterMutation.mutate("decrement")}
            >
              -1
            </button>
            <button
              disabled={isBusy}
              onClick={() => counterMutation.mutate("increment")}
            >
              +1
            </button>
          </div>
        </div>
        <p className="status">{statusMessage}</p>
        <p className="status status-error">{errorMessage ?? ""}</p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
