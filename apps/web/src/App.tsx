import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CounterResponse } from "@repo/contracts";

import {
  decrementCounter,
  fetchCounter,
  incrementCounter,
  resetCounter,
} from "./api/counter";
import { fetchNotes } from "./api/notes";
import "./App.css";

const counterQueryKey = ["counter"] as const;
const notesQueryKey = ["notes"] as const;
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
  const notesQuery = useQuery({
    queryKey: notesQueryKey,
    queryFn: ({ signal }) => fetchNotes(signal),
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
  const notes = notesQuery.data ?? [];
  const notesErrorMessage = notesQuery.error
    ? toErrorMessage(notesQuery.error)
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
      <h1>WeMagnus Monorepo Starter</h1>
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
      <div className="notes-header">
        <h2>Notes</h2>
        <button type="button" className="btn btn-success" disabled>
          Create Note
        </button>
      </div>
      <p className="status">
        {notesQuery.isLoading
          ? "Loading notes from API..."
          : notesQuery.isFetching
            ? "Refreshing notes..."
            : "Notes are loaded from Postgres through the API."}
      </p>
      <p className="status status-error">{notesErrorMessage ?? ""}</p>
      <div className="notes-list">
        {notes.length === 0 &&
        !notesQuery.isLoading &&
        notesErrorMessage === null ? (
          <div className="notes-empty">
            No notes found in the database yet.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={`note-item note-${note.type}`}>
              <div className="note-content">
                <p className="note-title">
                  <strong>{note.title}</strong>
                </p>
                <p className="note-body">{note.body}</p>
              </div>
              <div className="note-actions">
                <button type="button" className="btn btn-info" disabled>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" disabled>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
