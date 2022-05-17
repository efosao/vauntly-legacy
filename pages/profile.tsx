import { SimpleLayout } from "../components/layouts";
import { getSession, useSession, signOut } from "next-auth/react";

import { request } from "graphql-request";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export default function Page({ isAdmin }) {
  const { data: session }: any = useSession();
  const email = session?.user?.email;

  console.log({ session, isAdmin });

  function callSignOut() {
    signOut();
  }

  async function getUsers() {
    const session: any = await getSession();
    const { token } = session;

    const url = `${process.env.NEXT_PUBLIC_GQL_HOST}/v1/graphql`;
    const getUsersQuery = `query GetUsers {
      users {
        id
        email
        emailVerified
      }
    }
    `;

    try {
      const users = await request(
        url,
        getUsersQuery,
        {},
        {
          authorization: `Bearer ${token}`
        }
      );
      console.log({ users });
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div>Email: {email}</div>
      <div>Is Admin?: {session.isAdmin ? "True" : "False"}</div>
      <button className="button" onClick={callSignOut}>
        Sign out
      </button>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const token = req.cookies["next-auth.session-token"];
  if (!token) return { props: { isAdmin: false } };

  const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET, {
    algorithms: ["HS256"]
  });
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
  const isAdmin = adminEmails.includes(decodedToken?.email || "");
  return { props: { isAdmin } };
}

Page.auth = {
  role: "admin"
};

Page.layout = SimpleLayout;
Page.title = "Secured Page";
