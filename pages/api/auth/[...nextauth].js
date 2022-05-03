// https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
import { Sequelize, DataTypes } from "sequelize";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter";

const dbUrl = process.env.PG_DATABASE_URL;
const sequelize = new Sequelize(dbUrl, { logging: false });

sequelize.sync();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  callbacks: {
    async jwt(message) {
      // Persist the OAuth access_token to the token right after signin
      const { token, account, user } = message;

      if (user) {
        const administrators = ["efosao@gmail.com"];
        token.isAdmin = administrators.includes(user?.email);
      }

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token?.accessToken;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      user.roles = ["user"];
      return user;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: SequelizeAdapter(sequelize, {
    models: {
      User: sequelize.define("user", {
        ...models.User,
        phoneNumber: DataTypes.STRING,
        roles: {
          type: DataTypes.JSONB,
          defaultValue: ["user"],
        },
      }),
    },
  }),
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light",
  },
});
