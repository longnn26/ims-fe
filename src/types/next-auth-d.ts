import { MenuProps } from "antd";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    expires: Date;
    user: {
      access_token: string;
      tokenType: string;
      userId: string;
      expiresIn: number;
      userName: string;
      currenNoticeCount: number;
      roles: string[];
    } & DefaultSession["user"];
  }

  interface DefaultUser {
    access_token: string;
    tokenType: string;
    userId: string;
    expiresIn: number;
    userName: string;
    loginDate: string;
    currenNoticeCount: number;
    roles: string[];
  }
}

declare module "next-auth/jwt" {
  interface DefaultJWT extends Record<string, unknown> {
    access_token: string;
    tokenType: string;
    userId: string;
    expiresIn: number;
    userName: string;
    loginDate: string;
    currenNoticeCount: number;
    roles: string[];
  }
}

export type MenuItem = Required<MenuProps>["items"][number];
