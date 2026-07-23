import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uganthan-Vistas-Portfolio",
  icons: {
    icon: "/icons/Start-icon.png",
  },
  description:
    "A retro Windows XP & Vista inspired interactive portfolio showcasing Uganthan M's projects, skills, and creative work through a browser-based OS simulation.",
  keywords: [
    "Uganthan M",
    "portfolio",
    "interactive",
    "Windows XP",
    "Vista",
    "developer",
    "AI",
    "data science",
  ],
  authors: [{ name: "Uganthan M" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
