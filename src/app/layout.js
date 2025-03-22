import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { AuthProvider } from "@/contexts/AuthContext";
import RouteProtector from "@/components/RouteProtector";

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
      <AuthProvider>
        <html lang="es">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
          >
            <RouteProtector>{children}</RouteProtector>
          </body>
        </html>
      </AuthProvider>
    </LayoutProvider>
  );
}
