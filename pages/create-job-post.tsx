import Layout from "../components/layout";

export default function Page() {
  return (
    <div>
      <h1>Create Job Post</h1>
    </div>
  );
}

Page.getLayout = function getLayout(page) {
  return <Layout title="Create a Job Post">{page}</Layout>;
};
