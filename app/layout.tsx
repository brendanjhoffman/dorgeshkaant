import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import localFont from "next/font/local";

const runeScapeBold = localFont({
  src: "/RuneScape-Bold-12.ttf",
  variable: "--font-runescape",
});

export const metadata: Metadata = {
  title: "Dorgeshkaant | Goblins of the Mind Altar",
  description: "Goblins of the Mind Altar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${runeScapeBold.className} antialiased bg-black`}>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <SidebarTrigger className="text-yellow-300 m-1 hover:bg-zinc-600 hover:text-yellow-500" />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
