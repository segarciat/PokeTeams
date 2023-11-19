import type { Metadata } from "next";
import { prompt } from "@/app/ui/fonts";
import "@/app/ui/globals.css";
import Navbar from "@/app/ui/navbar";

export const metadata: Metadata = {
  title: "PokeTeams",
  description: "Pokemon-themed hobby project powered by PokeAPI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={prompt.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
