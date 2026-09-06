import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/types";

/** Stands in for real network time so loading states are actually exercised. */
const SIMULATED_LATENCY_MS = 420;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Every route awaits this first. Appending `?simulateError=1` to any request
 * makes the endpoint fail, which is how the error states are demonstrated
 * without breaking the app.
 */
export async function simulateNetwork(request: Request): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  if (new URL(request.url).searchParams.get("simulateError") === "1") {
    throw new ApiError(
      503,
      "UPSTREAM_UNAVAILABLE",
      "The catalog service is temporarily unavailable.",
    );
  }
}

/** Converts a thrown value into a consistent error envelope. */
export function errorResponse(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }

  console.error("Unhandled API error", error);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
    { status: 500 },
  );
}
