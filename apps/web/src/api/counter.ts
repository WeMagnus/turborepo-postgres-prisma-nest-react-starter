import { env } from "../env";
import {
  parseCounterResponse,
  type CounterResponse,
} from "@repo/contracts";

const baseUrl = `${env.VITE_API_URL}/counter`;

async function parseCounterHttpResponse(
  response: Response,
): Promise<CounterResponse> {
  if (!response.ok) {
    throw new Error(`Counter request failed (${response.status})`);
  }

  const payload: unknown = await response.json();
  return parseCounterResponse(payload);
}

export async function fetchCounter(): Promise<CounterResponse> {
  const response = await fetch(baseUrl);
  return parseCounterHttpResponse(response);
}

export async function incrementCounter(): Promise<CounterResponse> {
  const response = await fetch(`${baseUrl}/increment`, {
    method: "POST",
  });
  return parseCounterHttpResponse(response);
}

export async function decrementCounter(): Promise<CounterResponse> {
  const response = await fetch(`${baseUrl}/decrement`, {
    method: "POST",
  });
  return parseCounterHttpResponse(response);
}

export async function resetCounter(): Promise<CounterResponse> {
  const response = await fetch(`${baseUrl}/reset`, {
    method: "POST",
  });
  return parseCounterHttpResponse(response);
}
