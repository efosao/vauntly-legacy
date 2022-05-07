import { getToken } from "next-auth/jwt";
import { SimpleLayout } from "../components/layouts";
import { useSession, signOut } from "next-auth/react";

export default function Page({ isAdmin }) {
  const { data }: any = useSession();
  const email = data?.user?.email;

  function callSignOut() {
    signOut();
  }

  return (
    <>
      <div>Email: {email}</div>
      <div>Is Admin?: {isAdmin ? "True" : "False"}</div>
      <button className="button" onClick={callSignOut}>
        Sign out
      </button>
    </>
  );
}

Page.auth = {
  role: "admin",
};

export async function getServerSideProps({ req }) {
  const token = await getToken({ req });
  const isAdmin = token?.isAdmin || false;
  return { props: { isAdmin } };
}

Page.layout = SimpleLayout;
Page.title = "Secured Page";
