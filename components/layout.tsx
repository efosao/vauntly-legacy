import Head from "next/head";
import { ReactNode } from "react";
import Header from "./header";

interface PageProps {
  children: ReactNode;
  title: string | undefined;
}

const DEFAULT_TITLE = `FrontPosts`;

export default function Layout({ children, title }: PageProps) {
  const displayTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>{displayTitle}</title>
      </Head>
      <main>
        <Header />
        {children}
      </main>
    </div>
  );
}
