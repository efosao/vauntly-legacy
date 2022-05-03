import Link from "next/link";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";

export default function Secured({ isAdmin }) {
  const { data }: any = useSession();
  const email = data?.user?.email;

  return (
    <div>
      <h2>
        Go <Link href="/">Home</Link>
      </h2>
      <div>Email: {email}</div>
    </div>
  );
}

Secured.auth = {
  role: "admin",
};

export async function getServerSideProps({ req }) {
  const token = await getToken({ req });
  const isAdmin = token?.isAdmin || false;
  return { props: { isAdmin } };
}
