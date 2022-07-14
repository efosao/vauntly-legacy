// import { getToken } from "next-auth/jwt";
// import { useSession } from "next-auth/react";

import { SimpleLayout } from "../components/layouts";

export default function Page({ isAdmin }) {
  // const { data } = useSession();
  // const email = data?.user?.email;

  return (
    <>
      <div>Email: n/a</div>
      <div>Is Admin?: {isAdmin ? "True" : "False"}</div>
    </>
  );
}

Page.auth = {
  role: "admin"
};

export async function getServerSideProps({ req }) {
  // const token = await getToken({ req });
  // const isAdmin = token?.isAdmin || false;
  return { props: { isAdmin: null } };
}

Page.layout = SimpleLayout;
Page.title = "Secured Page";
