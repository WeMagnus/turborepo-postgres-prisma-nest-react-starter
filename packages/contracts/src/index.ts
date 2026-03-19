import { z } from "zod";

const counterResponseSchema = z.object({
  value: z.number().int(),
});

export type CounterResponse = z.infer<typeof counterResponseSchema>;

export function parseCounterResponse(data: unknown): CounterResponse {
  const parsed = counterResponseSchema.safeParse(data);
  if (!parsed.success) {
    console.error("❌ Invalid counter response shape");
    console.error(parsed.error.format());
    throw new Error("Invalid counter response shape");
  }

  return parsed.data;
}
