import { request } from "graphql-request";
import useSWR, { SWRConfig } from "swr";

import Results from "../components/results";

const url = `${process.env.NEXT_PUBLIC_GQL_HOST}/v1/graphql`;
const fetcher = (query: string) => request(url, query);
const getPostsQuery = `query GetPostsQuery {
  posts(limit: 30) {
    id
    location
    thumbnail
    title
    description
    company_name
    created_at
  }
}
`;

export async function getStaticProps() {
  // `getStaticProps` is executed on the server side.
  let fallback = { [getPostsQuery]: undefined };
  try {
    const posts = await request(url, getPostsQuery);
    fallback[getPostsQuery] = posts;
  } catch (error) {
    console.log({ error });
  }

  return { props: { fallback } };
}

interface PageProps {
  fallback:
    | {
        [key: string]: any;
      }
    | undefined;
}

export default function Page({ fallback }: PageProps) {
  const { data, error } = useSWR(getPostsQuery, fetcher, {
    fallback,
  });

  if (error) console.log({ error });

  const posts: [any] = data?.posts ?? [];

  return (
    <SWRConfig value={fallback}>
      <article className="prose lg:prose-2xl bg-white p-4 my-4 rounded-md shadow-lg mx-auto w-full">
        <h1>The freshest job postings in the industry.</h1>
        <div className="flex flex-col items-center justify-center bg-pink-200 px-4 py-2 w-full rounded-md md:flex-row">
          <p className="m-2 font-bold">Discover your next job today</p>
          <input
            className="rounded-lg m-4 border-2"
            placeholder="React Engineer"
            type="text"
          />
        </div>
      </article>

      <section className="px-2 sm:px-4 max-w-screen-lg mx-auto">
        <Results posts={posts} />
      </section>
    </SWRConfig>
  );
}

Page.title = "Fresh Job Posts";
