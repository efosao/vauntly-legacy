import { useSession, signIn, signOut } from "next-auth/react";
import { UserIcon } from "@heroicons/react/solid";
import Link from "next/link";
// import axios from "axios";

export default function Component() {
  const { data: session }: any = useSession();

  // async function getToken() {
  //   const { data } = await axios("/api/hello");
  //   console.log({ data });
  // }

  function callSignIn() {
    signIn();
  }

  if (session) {
    return (
      <>
        <Link href="/profile">
          <span className="bg-white p-2 rounded-full border-2 border-gray-500">
            <UserIcon
              className="flex-shrink-0 h-6 w-6 text-gray-500"
              aria-hidden="true"
            />
            {/* {session.user.email} */}
          </span>
        </Link>

        {/* <button className="button" onClick={getToken}>
          Get Token Data
        </button> */}
      </>
    );
  }
  return (
    <>
      <button className="button" onClick={callSignIn}>
        Sign in
      </button>
    </>
  );
}
