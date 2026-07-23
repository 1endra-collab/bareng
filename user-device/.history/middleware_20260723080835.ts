import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Tambahkan rute '/' ke dalam daftar rute publik
const isPublicRoute = createRouteMatcher([
  '/',                  // <--- Halaman utama sekarang publik
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}