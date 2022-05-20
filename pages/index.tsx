import { request } from "graphql-request";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useSWR, { SWRConfig } from "swr";

import Results from "../components/results";

const url = `${process.env.NEXT_PUBLIC_GQL_HOST}/v1/graphql`;
const fetcher = (query: string) => request(url, query);

function genGetPostsQuery(pg: number = 0, size: number = 10): string {
  return `query GetPostsQuery {
    posts(limit: ${size}, offset: ${
    pg * size
  }, order_by: {id: desc}, where: {published_at: {_is_null: false}}) {
      id
      location
      thumbnail
      title
      description
      company_name
      created_at
      state
    }
  }`;
}

const getPostsQuery = genGetPostsQuery(0);

export async function getStaticProps() {
  // `getStaticProps` is executed on the server side.
  let fallback = { [getPostsQuery]: null };
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
    revalidateOnMount: true
  });

  if (error) console.log({ error });

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(data?.posts ?? []);
  const postCount: number = posts.length;
  const loaderRef = useRef(null);

  async function fetchNextPage() {
    const nextPosts = await request(url, genGetPostsQuery(page + 1));
    setPage(page + 1);
    setPosts(posts.concat(nextPosts.posts));
    const hadResults = nextPosts.posts.length > 0;
    setHasMore(hadResults);
  }

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  useEffect(() => {
    const isLoaderVisible = isInViewport(loaderRef.current);
    if (isLoaderVisible) fetchNextPage();
    // eslint-disable-next-line
  }, []);

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

      <section className="flex px-2 sm:px-4 max-w-screen-lg mx-auto">
        <InfiniteScroll
          dataLength={postCount}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={<h4 ref={loaderRef}>Loading...</h4>}
          endMessage={
            <p className="m-4 p-4 flex justify-center text-3xl">🎉 🎉 🎉</p>
          }
          // below props only if you need pull down functionality
          // refreshFunction={this.refresh}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={50}
          // pullDownToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>
          //     &#8595; Pull down to refresh
          //   </h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          // }
        >
          <Results posts={posts} />
        </InfiniteScroll>
      </section>
    </SWRConfig>
  );
}

Page.title = "Fresh Job Posts";
