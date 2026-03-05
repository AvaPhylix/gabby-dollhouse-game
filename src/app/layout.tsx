import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cakey's Cat-Tastic Playhouse! 🎀",
  description: "A magical Gabby's Dollhouse game for kids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cakey-bg relative overflow-hidden">
        {children}
      </body>
    </html>
  );
}
