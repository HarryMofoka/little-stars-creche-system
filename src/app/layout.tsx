import type { Metadata } from "next";
import "@/styles.css";
import { AppProviders } from "./providers";
import { SiteNavWrapper } from "./site-nav-wrapper";

export const metadata: Metadata = {
  title: "Little Stars Preschool | Early Learning & Creche",
  description: "A registered creche and preschool for children aged 3 months to 6 years in Rosebank, Johannesburg.",
  authors: [{ name: "Little Stars Preschool" }],
  openGraph: {
    type: "website",
    title: "Little Stars Preschool",
    description: "Where every child shines bright. A registered creche and preschool.",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>
          <SiteNavWrapper />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
