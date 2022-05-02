import { request } from "graphql-request";
import type { NextPage } from "next";
import Head from "next/head";

import styles from "../styles/Home.module.css";
import Header from "../components/header";
import Results from "../components/results";

import useSWR, { SWRConfig } from "swr";

const url = `${process.env.NEXT_PUBLIC_GQL_HOST}/v1/graphql`;
const fetcher = (query: string) => request(url, query);
const getPostsQuery = `query GetPostsQuery {
  posts {
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

  const result = { props: { fallback } };

  return result;
}

const Home: NextPage = ({ fallback }: any) => {
  const { data, error } = useSWR(getPostsQuery, fetcher);
  if (error) console.log({ error });

  const posts: [any] = data?.posts ?? [];
  const SITE_DESCRIPTION: string = `The freshest job postings in the industry.`;

  return (
    <SWRConfig value={fallback}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Head>
          <title>FreshPosts</title>
          <meta name="description" content={SITE_DESCRIPTION} />
          <meta name="robots" content="noindex" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <Header />

          <article className="prose lg:prose-2xl px-4 mx-0 w-full max-w-full">
            <h1>The freshest job postings in the industry.</h1>
            <div className="flex justify-center bg-pink-200 w-full rounded-md">
              <p>Discover your next job today</p>
              <input
                className="rounded-lg m-4 border-2"
                placeholder="React Engineer"
                type="text"
              />
            </div>
          </article>

          <div className="px-4 py-6 sm:px-0">
            <div className="m-4 anchor">
              <Results posts={posts} />
            </div>
          </div>
        </main>
      </div>
    </SWRConfig>
  );
};

export default Home;
