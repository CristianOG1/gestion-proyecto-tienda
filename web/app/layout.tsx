import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCategories } from "@/lib/get-categories";
import { NavMenu } from "@/components/Menu";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiTienda",
  description: "Catálogo en línea de MiTienda, hecho con Next.js y Strapi.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getCategories()

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavMenu categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}