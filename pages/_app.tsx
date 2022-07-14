import "../styles/globals.css";

import type { AppProps } from "next/app";
import { NextPage } from "next/types";
import { ReactElement, ReactNode } from "react";

import { DefaultLayout, MainLayout } from "../components/layouts";
import FirebaseContext from "../context/firebaseContext";
import { app as fbApp, auth as fbAuth } from "../utils/firebaseAuth";

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

export default MyApp;
