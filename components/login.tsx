import { useSession, signIn, signOut } from "next-auth/react";
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
  function callSignOut() {
    signOut();
  }

  if (session) {
    return (
      <>
        <span className="label">{session.user.email}</span>
        <button className="button" onClick={callSignOut}>
          Sign out
        </button>
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
