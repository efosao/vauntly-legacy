import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { SimpleLayout } from "../components/layouts";
import requestClient from "../lib/request-client";

// export default function Page({ isAdmin }) {

export default function Page() {
  const sessionResult = useSession();
  const email = sessionResult.data?.user?.email;
  const isAdmin = !!sessionResult.data?.isAdmin;

  const [userData, setUserData] = useState({});

  function callSignOut() {
    window.location.href = "/logout";
  }

  async function getUsers() {
    const getUsersQuery = `query GetUsers {
      users {
        id
        email
        emailVerified
      }
    }
    `;

    try {
      const users = await requestClient(getUsersQuery, {});
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
      <div>Is Admin?: {isAdmin ? "True" : "False"}</div>
      <div className="m-4 border rounded p-4">
        <pre>{JSON.stringify(userData, null, 4)}</pre>
      </div>
      <button className="button" onClick={callSignOut}>
        Sign out
      </button>
    </>
  );
}

// export async function getServerSideProps({ req }) {
//   const token = req.cookies["next-auth.session-token"];
//   if (!token) return { props: { isAdmin: false } };

//   const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET, {
//     algorithms: ["HS256"]
//   });
//   const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
//   const isAdmin = adminEmails.includes(decodedToken?.email || "");
//   return { props: { isAdmin } };
// }

Page.auth = {
  role: "admin"
};

Page.layout = SimpleLayout;
Page.title = "Secured Page";
