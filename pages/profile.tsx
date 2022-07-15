import { SimpleLayout } from "../components/layouts";
import useSession from "../hooks/useSession";

export default function Page() {
  const { user, fbAuth } = useSession();

  async function callSignOut() {
    await fbAuth?.signOut();
    window.location.href = "/";
  }

  return (
    <>
      <div>Email: {user?.email}</div>
      <div className="m-4 border rounded p-4">
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(user, null, 4)}
        </pre>
      </div>
      <button className="button" onClick={callSignOut}>
        Sign out
      </button>
    </>
  );
}

Page.layout = SimpleLayout;
Page.title = "Profile";
