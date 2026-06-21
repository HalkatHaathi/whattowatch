import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-led" });

export const metadata: Metadata = {
  title: "Watch That Next",
  description: "Discover your next favorite movie or TV show with Watch That Next. Personalized recommendations, roulette spinner, and a curated list of top-rated media at your fingertips.",
  keywords: [
    "Watch That Next", "what to watch", "movies to watch", "where to watch", 
    "tv shows to watch", "where to watch love island", "movie", "tv-shows", 
    "media", "movie recommendation", "good movies to watch", "feel good movies", 
    "good tv shows to watch", "tv show recommendation", "webseries"
  ],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Watch That Next | Movie & TV Show Recommendations",
    description: "Discover your next favorite movie or TV show with Watch That Next. Personalized recommendations, roulette spinner, and a curated list of top-rated media at your fingertips.",
    url: "https://watchthatnext.com",
    siteName: "Watch That Next",
    images: [
      {
        url: "https://watchthatnext.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Watch That Next Recommendation Engine",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch That Next | Recommendations",
    description: "Find good movies to watch and the best tv show recommendations instantly with Watch That Next.",
    images: ["https://watchthatnext.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3977113276717477"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W6ZENNW7VW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-W6ZENNW7VW');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${vt323.variable} antialiased font-inter tracking-apple-body`}>
        {children}
      </body>
    </html>
  );
}
