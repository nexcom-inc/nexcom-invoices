import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Pages qui n'ont pas besoin de vérification d'organisation
  const publicPaths = ['/quicksetup']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Vérifier si on est sur une route /app/[orgId]/*
  const appRouteMatch = pathname.match(/^\/app\/([^\/]+)(.*)$/)
  
  if (appRouteMatch) {
    const [, orgId, subPath] = appRouteMatch
    
    // Ajouter l'orgId dans les headers pour l'utiliser côté client
    const response = NextResponse.next()
    response.headers.set('x-org-id', orgId)
    return response
  }

  // Si on est sur /app sans orgId, on laisse le composant gérer
  if (pathname === '/app' || pathname === '/app/') {
    return NextResponse.next()
  }

  // Pour les autres routes, rediriger vers /app
  if (!pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|nexcom-black.svg|nexcom-auth-illustration.svg|auth-background.jpg).*)",
  ],
}