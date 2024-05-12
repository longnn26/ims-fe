import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { isExpiredTimeToken } from "../utils/helpers";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as any;

  switch (pathname) {
    case "/signin":
      if (token && isExpiredTimeToken(token.loginDate, token.expiresIn))
        return NextResponse.redirect(`${origin}`);
      break;
    case "/":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/profile":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/receive":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/product":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/dashboard":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
  }
}
