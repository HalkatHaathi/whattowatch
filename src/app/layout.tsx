import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const vt323 = VT323({ weight: "400", subsets: ["latin"], variable: "--font-led" });

export const metadata: Metadata = {
  title: "Online Ruler & What to Watch | Movie & TV Show Recommendations",
  description: "Your ultimate online ruler for deciding what to watch. Find good movies to watch, feel good movies, and the best tv show recommendations instantly.",
  keywords: [
    "Online Ruler", "what to watch", "movies to watch", "where to watch", 
    "tv shows to watch", "where to watch love island", "movie", "tv-shows", 
    "media", "movie recommendation", "good movies to watch", "feel good movies", 
    "good tv shows to watch", "tv show recommendation", "webseries"
  ],
  openGraph: {
    title: "Online Ruler & What to Watch | Movie & TV Show Recommendations",
    description: "The ultimate online ruler for deciding what to watch. Find good movies to watch, feel good movies, and the best tv show recommendations instantly.",
    url: "https://whattowatch.com",
    siteName: "What To Watch",
    images: [
      {
        url: "https://whattowatch.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "What To Watch Recommendation Engine",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Ruler & What to Watch | Recommendations",
    description: "Find good movies to watch and the best tv show recommendations instantly.",
    images: ["https://whattowatch.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${vt323.variable} antialiased font-inter tracking-apple-body`}>
        {children}
      </body>
    </html>
  );
}
