import NewFormPost from "../components/new-post-form";
export default function Page() {
  return (
    <div className="m-6">
      <NewFormPost />
      <div className="h-20" />
    </div>
  );
}

Page.title = "Create a Job Post";
// Page.layout = SimpleLayout;
