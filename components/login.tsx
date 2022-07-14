import { UserIcon } from "@heroicons/react/solid";
import { User } from "firebase/auth";
import Link from "next/link";
import { useContext, useState } from "react";

import FirebaseContext from "../context/firebaseContext";
// import { signIn, useSession } from "next-auth/react";
// import axios from "axios";

export default function Component() {
  const { fbApp, fbAuth } = useContext(FirebaseContext);

  const [user, setUser] = useState<User | null>(null);

  fbAuth?.onAuthStateChanged((user) => {
    setUser(user);
    const email = user?.email;
    console.log({ email });
  });

  // const { data: session } = useSession();

  // async function getToken() {
  //   const { data } = await axios("/api/hello");
  //   console.log({ data });
  // }

  // function callSignIn() {
  //   signIn();
  // }

  if (user) {
    return (
      <>
        <Link href="/profile">
          <a className="bg-white p-2 rounded-full border-2 border-gray-500">
            <UserIcon
              className="flex-shrink-0 h-6 w-6 text-gray-500"
              aria-hidden="true"
            />
          </a>
        </Link>
        <span className="mx-4">{user.email}</span>

        {/* <button className="button" onClick={getToken}>
          Get Token Data
        </button> */}
      </>
    );
  }
  return (
    <>
      {/* <button className="button" onClick={callSignIn}>
        Sign in
      </button> */}
      <Link className="button" href="/auth">
        Sign in
      </Link>
    </>
  );
}
