import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Apply the middleware to all pages except:
// 1. /dashboard (exclude this specific route)
// 2. /admin/* (exclude all routes under /admin)
// 3. /_next/* (exclude Next.js static and image assets)
export const config = {
  matcher: [
    "/((?!dashboard|login|admin|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
