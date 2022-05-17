import { getSession, useSession, signOut } from "next-auth/react";
import { request } from "graphql-request";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

import { SimpleLayout } from "../components/layouts";

export default function Page({ isAdmin }) {
  const { data: session }: any = useSession();
  const email = session?.user?.email;
  const [userData, setUserData] = useState({});

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
      setUserData(users);
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
      <div className="m-4 border rounded p-4">
        <pre>{JSON.stringify(userData, null, 4)}</pre>
      </div>
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
