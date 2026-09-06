import { NextResponse, type NextRequest } from "next/server";
import { ApiError, errorResponse, simulateNetwork } from "@/server/http";
import { findProductById } from "@/server/repository";

/** GET /api/products/:id — full product detail, including every variant. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await simulateNetwork(request);

    const { id } = await params;
    const product = findProductById(id);

    if (!product) {
      throw new ApiError(404, "PRODUCT_NOT_FOUND", `No product matches "${id}".`);
    }

    return NextResponse.json(product);
  } catch (error) {
    return errorResponse(error);
  }
}
