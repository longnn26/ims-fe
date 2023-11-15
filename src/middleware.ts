import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { isExpiredTimeToken } from "../utils/helpers";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as any;

  if (req.url.includes(`/server`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    }
  }
  if (req.url.includes(`/area`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    }
  }
  switch (pathname) {
    case "/signin":
      if (token && isExpiredTimeToken(token.loginDate, token.expiresIn))
        return NextResponse.redirect(`${origin}`);
      break;
    case "/":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      } else {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/server`);
      }
    case "/customer":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
      break;
    case "/component":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
      break;
  }
}
