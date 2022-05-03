import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

export default function Component() {
  const { data: session }: any = useSession();

  async function getToken() {
    const { data } = await axios("/api/hello");
    console.log({ data });
  }

  function callSignIn() {
    signIn();
  }
  function callSignOut() {
    signOut();
  }

  if (session) {
    return (
      <div>
        <p>
          Signed in as <span className="label">{session.user.email}</span>
        </p>
        <button className="button" onClick={callSignOut}>
          Sign out
        </button>
        <button className="button" onClick={getToken}>
          Get Token Data
        </button>
      </div>
    );
  }
  return (
    <>
      <p>Not signed in </p>
      <button className="button" onClick={callSignIn}>
        Sign in
      </button>
    </>
  );
}
