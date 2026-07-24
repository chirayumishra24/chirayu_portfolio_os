import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { profile } from "../data/portfolio";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Full-Stack Developer Portfolio`,
    template: `%s | ${profile.name}`,
  },
  description: `${profile.name} is a ${profile.role}. Explore verified projects, skills, experience, resume, and contact details in ChirayuOS.`,
  keywords: [
    profile.name,
    "portfolio",
    "full-stack developer",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "product associate",
    "interactive portfolio",
  ],
  authors: [{ name: "Chirayu Mishra" }],
  creator: profile.name,
  publisher: profile.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${profile.name} — Full-Stack Developer Portfolio`,
    description: profile.recruiterSummary,
    url: "/",
    siteName: "ChirayuOS Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${profile.name} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Full-Stack Developer Portfolio`,
    description: profile.recruiterSummary,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.role,
      email: `mailto:${profile.email}`,
      url: siteUrl,
      sameAs: [profile.githubUrl],
      knowsAbout: profile.focusTags,
      address: {
        "@type": "PostalAddress",
        addressCountry: profile.location,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ChirayuOS Portfolio",
      url: siteUrl,
      description: profile.recruiterSummary,
      author: {
        "@type": "Person",
        name: profile.name,
      },
    },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
