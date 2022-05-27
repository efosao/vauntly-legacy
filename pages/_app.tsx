import { SessionProvider, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import { NextPage } from "next/types";
import { ReactElement, ReactNode } from "react";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import "../styles/globals.css";

import { DefaultLayout, MainLayout } from "../components/layouts";

type NextPageWithLayout = NextPage & {
  auth: boolean | {};
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout & {
    title: string | undefined;
    layout: ({ children }: { children: any }) => JSX.Element;
  };
};

type LayoutType = ({
  children
}: {
  children: any;
  title: string | null | undefined;
}) => JSX.Element;

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addDefaultLocale(en);

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
