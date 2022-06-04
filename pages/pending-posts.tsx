import { MinusIcon, PlusIcon, ShoppingCartIcon } from "@heroicons/react/solid";
import accounting from "accounting";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { SimpleLayout } from "../components/layouts";
import { SearchRow } from "../components/search-row";
import requestClient from "../lib/request-client";

type PostType = {
  company_name: string | undefined;
  created_at: string;
  description: string | undefined;
  external_id: string;
  published_at: string;
  thumbnail: string | null | undefined;
  title: string | null | undefined;
};

type PostsType = PostType[];

export default function PendingPosts() {
  const { data: session }: any = useSession();
  const [posts, setPosts] = useState<PostsType>([]);
  const [cart, setCart] = useState<Set<string>>(new Set());

  const getPosts = useCallback(async () => {
    const getUsersQuery = `query GetPosts($createdByUserId: uuid) {
      posts(where: {created_by_user_id: {_eq: $createdByUserId}}, order_by: {created_at: desc}) {
        company_name
        created_at
        description
        external_id
        id
        location
        published_at
        state
        thumbnail
        title
        updated_at
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
  }, [session]);

  function handleAddToCart(id) {
    return () => {
      const result = cart.add(id);
      setCart(new Set(result));
    };
  }

  const handleRemoveFromCart = useCallback(
    (id) => {
      return () => {
        const newCart: Set<string> = new Set();
        cart.forEach((itemId) => {
          if (itemId !== id) newCart.add(itemId);
        });
        setCart(newCart);
      };
    },
    [cart]
  );

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const postsInCart = posts.filter((p) => cart.has(p.external_id));
  const postsNotInCart = posts.filter((p) => !cart.has(p.external_id));

  return (
    <>
      <section className="bg-white p-4 my-4 rounded-lg shadow-xl mb-8">
        <h3 className="text-3xl font-bold text-indigo-400">Cart</h3>
        <div className="my-4">
          {postsInCart.map((p: PostType) => (
            <div className="flex gap-4" key={p.external_id}>
              <SearchRow
                company={p.company_name}
                publishedAt={p.published_at}
                description={p.description}
                extId={p.external_id}
                title={p.title}
                thumbnail={p.thumbnail}
              />
              <div className="flex justify-center items-center">
                <button className="button-plain bg-gray-200">Edit</button>
                <button
                  className="button-plain bg-red-200"
                  onClick={handleRemoveFromCart(p.external_id)}
                >
                  <MinusIcon className="h-5 w-5" />
                  <ShoppingCartIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

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
        {postsNotInCart.map((p) => (
          <div className="flex gap-4" key={p.external_id}>
            <SearchRow
              company={p.company_name}
              publishedAt={p.published_at}
              description={p.description}
              extId={p.external_id}
              title={p.title}
              thumbnail={p.thumbnail}
            />
            <div className="flex justify-center items-center">
              <button className="button-plain bg-gray-200">Edit</button>
              <button
                className="button-plain bg-green-200"
                onClick={handleAddToCart(p.external_id)}
              >
                <PlusIcon className="h-5 w-5" />
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

PendingPosts.title = "Pending Posts";
PendingPosts.layout = SimpleLayout;
