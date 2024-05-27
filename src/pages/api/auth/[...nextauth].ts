import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import moment from "moment";
import customer from "@services/customer";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "cus_credentials",
      name: "CusCredentials",
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
            expiresIn: result.expiresIn,
            loginDate: moment().format(),
            userId: result.userId,
            userName: result.userName,
            tokenType: result.tokenType,
            currenNoticeCount: result.currenNoticeCount,
            email: result.email,
            roles: result.roles,
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
        token.email = user.email;
        token.userId = user.userId;
        token.userName = user.userName;
        token.currenNoticeCount = user.currenNoticeCount;
        token.roles = user.roles;
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
        session.user.currenNoticeCount = token.currenNoticeCount;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
