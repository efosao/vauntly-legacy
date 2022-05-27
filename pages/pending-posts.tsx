import { MinusIcon, PlusIcon, ShoppingCartIcon } from "@heroicons/react/solid";
import accounting from "accounting";
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
    <>
      <section className="bg-white p-4 my-4 rounded-lg shadow-xl mb-8">
        <h3 className="text-3xl font-bold text-indigo-400">Cart</h3>
        <div className="my-4">
          {postsInCart.map(
            (p: {
              id: number;
              created_at: string;
              thumbnail: string | null | undefined;
              title: string | null | undefined;
              company_name: string | undefined;
              description: string | undefined;
            }) => (
              <div className="flex gap-4" key={p.id}>
                <SearchRow
                  company={p.company_name}
                  createdAt={p.created_at}
                  description={p.description}
                  // id={p.id}
                  title={p.title}
                  thumbnail={p.thumbnail}
                />
                <div className="flex justify-center items-center">
                  <button className="button-plain bg-gray-200">Edit</button>
                  <button
                    className="button-plain bg-red-200"
                    onClick={handleRemoveFromCart(p.id)}
                  >
                    <MinusIcon className="h-5 w-5" />
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )
          )}

          {!postsInCart || postsInCart.length === 0 ? (
            <p className="text-2xl font-semibold text-gray-400 justify-center flex">
              Cart is empty
            </p>
          ) : null}

          <div className="flex justify-end items-center">
            <p className="mx-8 text-2xl">
              Total: {accounting.formatMoney(postsInCart.length * 400)}
            </p>
            <button className="bg-blue-200 p-4 rounded-lg font-bold">
              Checkout with PayPal
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white p-4 my-4 rounded-lg shadow-xl mb-8">
        <h3 className="text-3xl font-bold text-indigo-400">Pending</h3>
        {postsNotInCart.map(
          (p: {
            id: number;
            created_at: string;
            thumbnail: string | null | undefined;
            title: string | null | undefined;
            company_name: string | undefined;
            description: string | undefined;
          }) => (
            <div className="flex gap-4" key={p.id}>
              <SearchRow
                company={p.company_name}
                createdAt={p.created_at}
                description={p.description}
                // id={p.id}
                title={p.title}
                thumbnail={p.thumbnail}
              />
              <div className="flex justify-center items-center">
                <button className="button-plain bg-gray-200">Edit</button>
                <button
                  className="button-plain bg-green-200"
                  onClick={handleAddToCart(p.id)}
                >
                  <PlusIcon className="h-5 w-5" />
                  <ShoppingCartIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )
        )}
      </section>
    </>
  );
}

PendingPosts.title = "Pending Posts";
PendingPosts.layout = SimpleLayout;
