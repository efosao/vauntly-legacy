import "../styles/globals.css";

import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import { NextPage } from "next/types";
import { ReactElement, ReactNode } from "react";

// import superjson from "superjson";
import { DefaultLayout, MainLayout } from "~/components/layouts";
import FirebaseContext from "~/context/FBContext";
import { app as fbApp, auth as fbAuth } from "~/utils/firebaseAuth";
import { SSRContext } from "~/utils/trpc";

import { AppRouter } from "./api/trpc/[trpc]";

type NextPageWithLayout = NextPage & {
  auth: boolean | Record<string, unknown>;
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout & {
    title: string | undefined;
    // eslint-disable-next-line no-unused-vars
    layout: ({ children }: { children: ReactElement }) => JSX.Element;
  };
};

type LayoutType = ({
  // eslint-disable-next-line no-unused-vars
  children
}: {
  children: ReactElement;
  title: string | null | undefined;
}) => JSX.Element;

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const { title } = Component;
  const Layout: LayoutType = Component.layout || DefaultLayout;
  return (
    <FirebaseContext.Provider value={{ fbApp, fbAuth }}>
      <MainLayout title={title}>
        <Layout title={title}>
          <Component {...pageProps} />
        </Layout>
      </MainLayout>
    </FirebaseContext.Provider>
  );
}

// function Auth({ children, isAdmin }) {
//   // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
//   const session = useSession({ required: true });
//   const { status } = session;

//   console.log({ AuthIsAdmin: isAdmin });

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   return children;
// }

// export default MyApp;
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    // const url = process.env.VERCEL_URL
    //   ? `https://${process.env.VERCEL_URL}/api/trpc`
    //   : "http://localhost:3000/api/trpc";
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error)
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`
        })
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      // transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      url
    };
  },
  responseMeta(opts) {
    const ctx = opts.ctx as SSRContext;

    if (ctx.status) {
      // If HTTP status set, propagate that
      return {
        status: ctx.status
      };
    }

    const error = opts.clientErrors[0];
    if (error) {
      // Propagate http first error from API calls
      return {
        status: error.data?.httpStatus ?? 500
      };
    }
    // For app caching with SSR see https://trpc.io/docs/caching
    return {};
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true
  /**
   * Set headers or status code when doing SSR
   */
})(MyApp);

// export default withTRPC<AppRouter>({
//   config({ ctx }) {
//     /**
//      * If you want to use SSR, you need to use the server's full URL
//      * @link https://trpc.io/docs/ssr
//      */
//     const url = process.env.VERCEL_URL
//       ? `https://${process.env.VERCEL_URL}/api/trpc`
//       : "http://localhost:3000/api/trpc";

//     return {
//       url
//       /**
//        * @link https://react-query.tanstack.com/reference/QueryClient
//        */
//       // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
//     };
//   },
//   /**
//    * @link https://trpc.io/docs/ssr
//    */
//   ssr: true
// })(MyApp);
