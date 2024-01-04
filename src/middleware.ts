import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { areInArray, isExpiredTimeToken } from "../utils/helpers";
import {
  ROLE_ADMIN,
  ROLE_CUSTOMER,
  ROLE_SALES,
  ROLE_TECH,
} from "@utils/constants";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as any;

  if (req.url.includes(`/server`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_TECH, ROLE_SALES, ROLE_CUSTOMER)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/ipSubnet`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_TECH)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/requestUpgrade`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_TECH, ROLE_SALES, ROLE_CUSTOMER)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/appointment`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_TECH, ROLE_SALES, ROLE_CUSTOMER)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/area`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_TECH)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/requestHost`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_TECH, ROLE_SALES, ROLE_CUSTOMER)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/customer`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_TECH, ROLE_SALES)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/requestExpand`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    }
  }
  if (req.url.includes(`/changePassword`)) {
    if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
    } else {
      if (!areInArray(token?.roles, ROLE_CUSTOMER)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
      }
    }
  }
  if (req.url.includes(`/myAccount`)) {
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
        if (areInArray(token?.roles, ROLE_ADMIN)) {
          return NextResponse.redirect(
            `${process.env.NEXTAUTH_URL}/staffAccount`
          );
        } else {
          return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/server`);
        }
      }
    case "/component":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      } else {
        if (!areInArray(token?.roles, ROLE_TECH)) {
          return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
        }
      }
      break;
    case "/staffAccount":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      } else {
        if (!areInArray(token?.roles, ROLE_ADMIN)) {
          return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
        }
      }
      break;
    case "/staffAccount":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      } else {
        if (!areInArray(token?.roles, ROLE_ADMIN)) {
          return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
        }
      }
      break;
    case "/informationDC":
      if (!token || !isExpiredTimeToken(token.loginDate, token.expiresIn)) {
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/signin`);
      } else {
        if (!areInArray(token?.roles, ROLE_ADMIN)) {
          return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/empty`);
        }
      }
      break;
  }
}
