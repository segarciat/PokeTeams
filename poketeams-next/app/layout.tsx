import type { Metadata } from "next";
import "@/app/ui/globals.css";
import Providers from "./providers";

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
      <Providers>{children}</Providers>
    </html>
  );
}
