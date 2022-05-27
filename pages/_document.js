import Document, { Head, Html, Main, NextScript } from "next/document";

const SITE_DESCRIPTION = `The freshest job postings in the industry.`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content={SITE_DESCRIPTION} />
          <meta name="robots" content="noindex" />
          <link rel="icon" href="/favicon.ico" />
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;400;700;800&display=swap"
            rel="stylesheet"
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
