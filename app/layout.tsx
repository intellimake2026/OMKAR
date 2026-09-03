import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OMKAR — Open Manufacturing Knowledge & Research",
  description: "Explore manufacturing processes, materials, tooling, and engineering knowledge.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
