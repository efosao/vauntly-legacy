import Link from "next/link";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import Layout from "../components/layout";

export default function Page({ isAdmin }) {
  const { data }: any = useSession();
  const email = data?.user?.email;

  return (
    <>
      <div>Email: {email}</div>
      <div>Is Admin?: {isAdmin ? "True" : "False"}</div>
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

Page.getLayout = function getLayout(page) {
  return <Layout title="Secured Page">{page}</Layout>;
};
