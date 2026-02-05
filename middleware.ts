import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    // TEMPORARY: Bypass all middleware logic to unblock 500 error.
    // We will re-enable auth once the base deployment is stable.
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
