import "../styles/globals.css";

import type { AppProps } from "next/app";
import { NextPage } from "next/types";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactElement, ReactNode } from "react";

import { DefaultLayout, MainLayout } from "../components/layouts";

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

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) {
  const { title } = Component;
  const Layout: LayoutType = Component.layout || DefaultLayout;
  return (
    <SessionProvider session={session}>
      <MainLayout title={title}>
        <Layout title={title}>
          {Component.auth ? (
            <Auth isAdmin={pageProps.isAdmin || false}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </MainLayout>
    </SessionProvider>
  );
}

function Auth({ children, isAdmin }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const session = useSession({ required: true });
  const { status } = session;

  console.log({ AuthIsAdmin: isAdmin });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}

export default MyApp;
