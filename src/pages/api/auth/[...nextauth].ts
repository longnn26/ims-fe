import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userService from "@services/user";
import moment from "moment";
import customer from "@services/customer";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        var result = await userService.login(
          credentials?.username!,
          credentials?.password!
        );

        if (result) {
          const user = {
            id: result.userId,
            name: result.userName,
            access_token: result.access_token,
            expiresIn: result.expires_in,
            loginDate: moment().format(),
            userId: result.userId,
            userName: result.userName,
            tokenType: result.tokenType
          } as User;
          return user;
        } else {
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "customer_credentials",
      name: "CustomerCredentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        var result = await customer.login(
          credentials?.email!,
          credentials?.password!
        );

        if (result) {
          const user = {
            id: result.userId,
            name: result.userName,
            access_token: result.access_token,
            expiresIn: result.expires_in,
            loginDate: moment().format(),
            userId: result.userId,
            userName: result.userName,
            tokenType: result.tokenType
          } as User;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.expiresIn = user.expiresIn;
        token.loginDate = user.loginDate;
        // token.email = user.email;
        token.userId = user.userId;
        token.userName = user.userName;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session?.user };
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session) {
        session.expires = moment(token.loginDate)
          .add(token.expiresIn, "seconds")
          .toDate();
        session.user.access_token = token.access_token;
        // session.user.email = token.email;
        session.user.userName = token.userName;
        session.user.userId = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
