import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const prisma = new PrismaClient();

const providers = [EmailProvider({
  from: process.env.EMAIL_FROM,
  server: process.env.EMAIL_SERVER,
}),
GithubProvider({
  checks: "none",
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
})];

const googleProvider = (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) ? GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
}) : undefined;

if (googleProvider) providers.push(googleProvider);

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt(message) {
      // Persist the OAuth access_token to the token right after signin
      // INFO: only [token] has data on post-signin requests, [profile] is always empty
      const { account, token, user } = message;
      const email = token.email;
      const userId = user?.id || token.sub;

      if (userId) {
        token.id = userId;
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
        token.isAdmin = adminEmails.includes(email || "");
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session(sessionData) {
      const { session, token } = sessionData;
      const encodedToken = jwt.sign(token, NEXTAUTH_SECRET, { algorithm: 'HS256' });
      // Send properties to the client, like an access_token from a provider.
      session.isAdmin = token.isAdmin;
      session.id = token.id;
      session.token = encodedToken;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      user.roles = ["user"];
    },
  },
  jwt: {
    decode: async ({ secret, token }) => {
      const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
      return decodedToken;
    },
    encode: async ({ secret, token }) => {
      const jwtClaims = {
        "email": token?.email,
        "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-role": "user",
          "x-hasura-user-id": token?.id,
        },
        "iat": Date.now() / 1000,
        "name": token?.name,
        "sub": token?.id,
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: 'HS256' });
      return encodedToken;
    },
  },
  providers,
  secret: NEXTAUTH_SECRET,
  session: {
    maxAge: 60 * 60 * 24,
    strategy: "jwt",
    updateAge: 60 * 60 * 4
  },
  theme: {
    colorScheme: "light",
  },
});
