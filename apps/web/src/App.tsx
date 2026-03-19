import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    queryFn: fetchCounter,
  });

  const incrementMutation = useMutation({
    mutationFn: incrementCounter,
    onSuccess: (data) => {
      queryClient.setQueryData(counterQueryKey, data);
    },
  });

  const decrementMutation = useMutation({
    mutationFn: decrementCounter,
    onSuccess: (data) => {
      queryClient.setQueryData(counterQueryKey, data);
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetCounter,
    onSuccess: (data) => {
      queryClient.setQueryData(counterQueryKey, data);
    },
  });

  const isMutating =
    incrementMutation.isPending ||
    decrementMutation.isPending ||
    resetMutation.isPending;
  const isBusy = counterQuery.isLoading || isMutating;
  const value = counterQuery.data?.value ?? 0;
  const mutationError =
    incrementMutation.error ?? decrementMutation.error ?? resetMutation.error;
  const errorMessage = counterQuery.error
    ? toErrorMessage(counterQuery.error)
    : mutationError
      ? toErrorMessage(mutationError)
      : null;

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
              {value}
            </output>
            <button disabled={isBusy} onClick={() => resetMutation.mutate()}>
              Reset
            </button>
          </div>

          <div className="button-row">
            <button disabled={isBusy} onClick={() => decrementMutation.mutate()}>
              -1
            </button>
            <button disabled={isBusy} onClick={() => incrementMutation.mutate()}>
              +1
            </button>
          </div>

        </div>
        <p className="status">
          {counterQuery.isLoading
            ? "Loading current value from API..."
            : isMutating
              ? "Saving..."
              : "Counter value is persisted in Postgres."}
        </p>
        <p className="status status-error">{errorMessage ?? ""}</p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
