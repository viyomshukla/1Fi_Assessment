import { NextResponse, type NextRequest } from "next/server";
import { ApiError, errorResponse, simulateNetwork } from "@/server/http";
import { findProducts } from "@/server/repository";
import type { CategoryId } from "@/types";

const MAX_LIMIT = 24;

/**
 * GET /api/products?search=&category=&cursor=&limit=
 *
 * Returns a page of product summaries for the Marketplace listing.
 */
export async function GET(request: NextRequest) {
  try {
    await simulateNetwork(request);

    const params = request.nextUrl.searchParams;
    const rawLimit = params.get("limit");
    const limit = rawLimit ? Number.parseInt(rawLimit, 10) : undefined;

    if (limit !== undefined && (!Number.isFinite(limit) || limit < 1)) {
      throw new ApiError(400, "INVALID_LIMIT", "limit must be a positive number.");
    }

    return NextResponse.json(
      findProducts({
        search: params.get("search") ?? undefined,
        category: (params.get("category") as CategoryId | null) ?? undefined,
        cursor: params.get("cursor"),
        limit: limit ? Math.min(limit, MAX_LIMIT) : undefined,
      }),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
