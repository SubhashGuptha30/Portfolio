import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { client, urlFor } from "@/lib/sanity";
import { siteSettingsQuery } from "@/lib/queries";

const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/Geist-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Geist-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono-Regular.ttf",
  variable: "--font-geist-mono",
  weight: "400",
  style: "normal",
});

const syne = localFont({
  src: [
    {
      path: "../public/fonts/Syne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Syne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-syne",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(siteSettingsQuery);

  const title = settings?.seoTitle || settings?.name || "Portfolio";
  const description = settings?.seoDescription || settings?.heroSummary || "Full Stack Developer Portfolio";
  const keywords = settings?.seoKeywords || ["Portfolio", "Developer", "Full Stack", "React", "Next.js"];
  const ogImage = settings?.ogImage ? urlFor(settings.ogImage).width(1200).height(630).url() : "/og-image.jpg";

  return {
    metadataBase: new URL('https://subhashguptha.com'),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://subhashguptha.com", // Replace with actual URL if known, or make dynamic
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await client.fetch(siteSettingsQuery);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": settings?.name || "Subhash Guptha",
    "url": "https://subhashguptha.com", // Replace with actual URL
    "sameAs": [
      settings?.socialLinks?.github,
      settings?.socialLinks?.linkedin,
      // Add other social links if available
    ].filter(Boolean),
    "jobTitle": settings?.role || "Full Stack Developer",
    "description": settings?.heroSummary || "Full Stack Developer Portfolio",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased cursor-none`}
        suppressHydrationWarning
      >
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
