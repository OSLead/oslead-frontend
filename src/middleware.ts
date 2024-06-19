import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const allCookies = request.cookies.getAll()
  const isTokenPresent = request.cookies.has('x-access-token')
  console.log(request.nextUrl)
  const userType = request.cookies.get('user-type')

  console.log('User Type:', userType)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/usertype'],
}