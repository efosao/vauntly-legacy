import { useSession } from "next-auth/react";
import { SimpleLayout } from "../components/layouts";

export default function Page() {
  const sessionResult = useSession();
  const email = sessionResult.data?.user?.email;
  const isAdmin = !!sessionResult.data?.isAdmin;

  function callSignOut() {
    window.location.href = "/logout";
  }

  return (
    <>
      <div>Email: {email}</div>
      <div>Is Admin?: {isAdmin ? "True" : "False"}</div>
      <div className="m-4 border rounded p-4">
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(sessionResult, null, 4)}
        </pre>
      </div>
      <button className="button" onClick={callSignOut}>
        Sign out
      </button>
    </>
  );
}

Page.layout = SimpleLayout;
Page.title = "Secured Page";
