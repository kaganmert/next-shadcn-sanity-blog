import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

/** Leaves draft mode and returns to the page the editor was on. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  const path = safeRedirectPath(request.nextUrl.searchParams.get("redirect"));
  return NextResponse.redirect(new URL(path, request.url));
}
