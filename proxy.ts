import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fumadocs markdown content negotiation.
// Currently a pass-through; extend here if auth middleware is added later
// (Next.js allows exactly one proxy.ts, so they must be merged).
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}
