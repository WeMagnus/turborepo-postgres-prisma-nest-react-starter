import { z } from "zod";

const counterResponseSchema = z.object({
  value: z.number().int(),
});

const noteIdSchema = z.string().uuid();

const noteResponseSchema = z.object({
  id: noteIdSchema,
  title: z.string().min(1),
  body: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const createNoteInputSchema = z.object({
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
});

const updateNoteInputSchema = createNoteInputSchema
  .partial()
  .refine((data) => data.title !== undefined || data.body !== undefined, {
    message: "At least one field must be provided",
  });

const notesResponseSchema = z.array(noteResponseSchema);

export type CounterResponse = z.infer<typeof counterResponseSchema>;
export type NoteId = z.infer<typeof noteIdSchema>;
export type NoteResponse = z.infer<typeof noteResponseSchema>;
export type NotesResponse = z.infer<typeof notesResponseSchema>;
export type CreateNoteInput = z.infer<typeof createNoteInputSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteInputSchema>;

export function parseCounterResponse(data: unknown): CounterResponse {
  const parsed = counterResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Invalid counter response shape");
    console.error(parsed.error.format());
    throw new Error("Invalid counter response shape");
  }

  return parsed.data;
}

export function parseNoteId(data: unknown): NoteId {
  const parsed = noteIdSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Invalid note id");
    console.error(parsed.error.format());
    throw new Error("Invalid note id");
  }

  return parsed.data;
}

export function parseNoteResponse(data: unknown): NoteResponse {
  const parsed = noteResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Invalid note response shape");
    console.error(parsed.error.format());
    throw new Error("Invalid note response shape");
  }

  return parsed.data;
}

export function parseNotesResponse(data: unknown): NotesResponse {
  const parsed = notesResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Invalid notes response shape");
    console.error(parsed.error.format());
    throw new Error("Invalid notes response shape");
  }

  return parsed.data;
}

export function parseCreateNoteInput(data: unknown): CreateNoteInput {
  const parsed = createNoteInputSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Invalid create note payload");
    console.error(parsed.error.format());
    throw new Error("Invalid create note payload");
  }

  return parsed.data;
}

export function parseUpdateNoteInput(data: unknown): UpdateNoteInput {
  const parsed = updateNoteInputSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Invalid update note payload");
    console.error(parsed.error.format());
    throw new Error("Invalid update note payload");
  }

  return parsed.data;
}
