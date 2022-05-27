import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter";
import jwt from 'jsonwebtoken';
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { DataTypes, Sequelize } from "sequelize";

const dbUrl = process.env.PG_DATABASE_URL || '';
const sequelize = new Sequelize(dbUrl, { logging: false });
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
// sequelize.sync();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  adapter: SequelizeAdapter(sequelize, {
    models: {
      User: sequelize.define("user", {
        ...models.User,
        phoneNumber: DataTypes.STRING,
        roles: {
          defaultValue: ["user"],
          type: DataTypes.JSONB,
        },
      }),
    },
  }),
  callbacks: {
    async jwt(message) {
      // Persist the OAuth access_token to the token right after signin
      // INFO: only [token] has data on post-signin requests, [profile] is always empty
      const { account, token, user } = message;
      let email = token.email;
      let userId = user?.id || token.sub;

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
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: process.env.EMAIL_SERVER,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "light",
  },
});
