import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"


export function middleware(request: NextRequest) {
  const token = request.cookies.get("connect.sid")
  console.log("tooken", token);
  


  if (!token) {
    return NextResponse.redirect(new URL(`http://localhost:8000/auth/login?next=${request.url}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|nexcom-black.svg|nexcom-auth-illustration.svg|auth-background.jpg).*)",
  ],
}