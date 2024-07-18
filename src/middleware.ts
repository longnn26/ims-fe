import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { isExpiredTimeToken } from "../utils/helpers";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as any;
  if (req.url.includes(`/units-of-measure`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    }
  }
  if (req.url.includes(`/product-categories`)) {
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
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/products`);
      }
    case "/lots-serial-numbers":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      } else {
      }
    case "/product-variants":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/products":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/profile":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/receipts":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/internal":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/deliveries":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/warehouses":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/units-of-measure":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
    case "/product-categories":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      }
  }
}
