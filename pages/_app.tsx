import "../styles/globals.css";
import type { AppProps } from "next/app";
import TimeAgo from "javascript-time-ago";
import { SessionProvider, useSession } from "next-auth/react";

import en from "javascript-time-ago/locale/en.json";
import { NextComponentType, NextPageContext } from "next/types";

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addDefaultLocale(en);

interface AuthAppProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, {}> & {
    auth: boolean | {};
  };
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AuthAppProps) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth isAdmin={pageProps.isAdmin || false}>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
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
