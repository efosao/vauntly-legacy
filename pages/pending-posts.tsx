import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { SimpleLayout } from "../components/layouts";
import { SearchRow } from "../components/search-row";
import requestClient from "../lib/request-client";

type PostType = {
  id: number;
  created_at: string;
  thumbnail: string | null | undefined;
  title: string | null | undefined;
  company_name: string | undefined;
  description: string | undefined;
};

type PostsType = PostType[];

export default function PendingPosts() {
  const { data: session }: any = useSession();
  const [posts, setPosts] = useState<PostsType>([]);
  const [cart, setCart] = useState<Set<number>>(new Set());

  async function getPosts() {
    const getUsersQuery = `query GetPosts($createdByUserId: uuid) {
      posts(where: {created_by_user_id: {_eq: $createdByUserId}}, order_by: {created_at: desc}) {
        company_name
        updated_at
        title
        thumbnail
        state
        published_at
        location
        id
        description
        created_at
      }
    }`;

    try {
      if (!session) return;
      const { id: createdByUserId } = session;
      const result = await requestClient(getUsersQuery, { createdByUserId });
      setPosts(result.posts);
    } catch (error) {
      console.log({ error });
    }
  }

  const memoizedGetPosts = useCallback(getPosts, [session]);
  function handleAddToCart(id) {
    return () => {
      const result = cart.add(id);
      setCart(new Set(result));
    };
  }

  function handleRemoveFromCart(id) {
    return () => {
      const newCart: Set<number> = new Set();
      cart.forEach((itemId) => {
        if (itemId !== id) newCart.add(itemId);
      });
      setCart(newCart);
    };
  }

  useEffect(() => {
    memoizedGetPosts();
  }, [memoizedGetPosts]);

  const postsInCart = posts.filter((p) => cart.has(p.id));
  const postsNotInCart = posts.filter((p) => !cart.has(p.id));

  return (
    <div>
      <h3>Cart</h3>
      {postsInCart.map(
        (p: {
          id: number;
          created_at: string;
          thumbnail: string | null | undefined;
          title: string | null | undefined;
          company_name: string | undefined;
          description: string | undefined;
        }) => (
          <div className="flex" key={p.id}>
            <SearchRow
              company={p.company_name}
              createdAt={p.created_at}
              description={p.description}
              id={p.id}
              title={p.title}
              thumbnail={p.thumbnail}
            />
            <div className="flex justify-center items-center">
              <button className="button">Edit</button>
              <button className="button" onClick={handleRemoveFromCart(p.id)}>
                Remove from Cart
              </button>
            </div>
          </div>
        )
      )}
      <section>
        <p>Total: ${postsInCart.length * 400}</p>
      </section>
      <h3>Pending</h3>
      {postsNotInCart.map(
        (p: {
          id: number;
          created_at: string;
          thumbnail: string | null | undefined;
          title: string | null | undefined;
          company_name: string | undefined;
          description: string | undefined;
        }) => (
          <div className="flex" key={p.id}>
            <SearchRow
              company={p.company_name}
              createdAt={p.created_at}
              description={p.description}
              id={p.id}
              title={p.title}
              thumbnail={p.thumbnail}
            />
            <div className="flex justify-center items-center">
              <button className="button">Edit</button>
              <button className="button" onClick={handleAddToCart(p.id)}>
                Add to Cart
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

PendingPosts.title = "Pending Posts";
PendingPosts.layout = SimpleLayout;
