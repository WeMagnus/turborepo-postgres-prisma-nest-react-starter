import { env } from "../env";
import { parseNotesResponse, type NotesResponse } from "@repo/contracts";

const baseUrl = `${env.VITE_API_URL}/notes`;

export async function fetchNotes(signal?: AbortSignal): Promise<NotesResponse> {
  const response = await fetch(baseUrl, { signal });

  if (!response.ok) {
    throw new Error(`Notes request failed (${response.status})`);
  }

  const payload: unknown = await response.json();
  return parseNotesResponse(payload);
}
