import type { ApiErrorBody } from "@/types";

/** Error carrying the API's own code, so callers can branch on 404 vs 503. */
export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

type QueryValue = string | number | boolean | null | undefined;

/**
 * Demo hook: loading the app with `?simulateError=1` forwards that flag to
 * every request, so error states can be shown without editing code. Absent in
 * normal use.
 */
function inheritedDemoFlags(): Record<string, QueryValue> {
  if (typeof window === "undefined") return {};
  const simulateError = new URLSearchParams(window.location.search).get(
    "simulateError",
  );
  return simulateError === "1" ? { simulateError: "1" } : {};
}

function buildUrl(path: string, params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries({
    ...params,
    ...inheritedDemoFlags(),
  })) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

/** Typed GET against the app's own API routes. */
export async function apiGet<T>(
  path: string,
  params: Record<string, QueryValue> = {},
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiClientError(
      response.status,
      body?.error.code ?? "UNKNOWN",
      body?.error.message ?? "The request failed.",
    );
  }

  return (await response.json()) as T;
}
