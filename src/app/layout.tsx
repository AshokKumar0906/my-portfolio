import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Ashok Kumar L — Machine Learning Engineer";
const description =
  "Machine Learning Engineer specialising in agentic AI, RAG systems, LLM fine-tuning, and production AI automation.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ashok-kumar-l-portfolio.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://ashok-kumar-l-portfolio.vercel.app",
    siteName: title,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
