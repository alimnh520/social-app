import { NextResponse } from 'next/server'

export function middleware(req) {
    const pathName = req.nextUrl.pathname;
    const otp = req.cookies.get('otp')?.value;
    const accessToken = req.cookies.get('user-token')?.value;

    const accessPath = ['/user/signin' , '/user/signup' , '/user/verify'];
    const avoidPath = ['/user/dashboard']

    if (!otp && pathName === '/user/verify') {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (!accessToken && avoidPath.includes(pathName)) {
        return NextResponse.redirect(new URL('/user/signin', req.url));
    }
    if (accessToken && accessPath.includes(pathName)) {
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