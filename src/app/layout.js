import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import { LayoutProvider } from "@/contexts/LayoutContext";
import NavigationModal from "@/components/NavigationModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cobro diario",
  description: "Aplicacion de cobro diario",
};

export default function RootLayout({ children }) {
  return (
    <LayoutProvider>
      <html lang="es">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
        >
          <Header />
          <NavigationModal />
          <main className="overflow-auto mt-10 mb-16 flex-1">{children}</main>
          <NavBar />
        </body>
      </html>
    </LayoutProvider>
  );
}
