import { NextResponse } from 'next/server'

export function middleware(req) {
    const pathName = req.nextUrl.pathname;
    const otp = req.cookies.get('otp')?.value;
    const accessToken = req.cookies.get('user-token')?.value;

    if (!otp && pathName === '/user/verify') {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (!accessToken && pathName === '/user/dashboard') {
        return NextResponse.redirect(new URL('/user/signin', req.url));
    }
    if (accessToken && pathName === '/user/signin') {
        return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }
    if (accessToken && pathName === '/user/signup') {
        return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }
}

export const config = {
    matcher: [
        '/',
        '/user/verify',
        '/user/dashboard',
        '/user/signin',
        '/user/signup'
    ],
}