import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beautime Admin",
  description: "Painel de administração do aplicativo Beautime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="antialiased">{children}</body>
    </html>
  );
}
