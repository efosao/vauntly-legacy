import Head from "next/head";
import { ReactNode } from "react";

import Header from "../header";

interface PageProps {
  children: ReactNode;
  title: string | undefined;
}

const DEFAULT_TITLE = `Vauntly`;

export function MainLayout({ children, title }: PageProps) {
  const displayTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  return (
    <>
      <Head>
        <title>{displayTitle}</title>
      </Head>
      <main className="bg-gray-100 min-h-screen">
        <Header />
        {children}
      </main>
    </>
  );
}
