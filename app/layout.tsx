import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "CreatorPulse — Content, in perspective",
    template: "%s | CreatorPulse",
  },
  description:
    "Analyze public TikTok and YouTube video links, explore content performance, and plan your next creative move with honest data.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
