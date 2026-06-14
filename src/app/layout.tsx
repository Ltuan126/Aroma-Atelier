import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aroma Atelier – Tinh Hoa Hương Thơm Tự Nhiên",
    template: "%s | Aroma Atelier",
  },
  description:
    "Khám phá bộ sưu tập nước hoa cao cấp, tinh dầu tự nhiên và nến thơm nghệ thuật được chế tác thủ công tại Aroma Atelier.",
  keywords: ["nước hoa", "tinh dầu tự nhiên", "nến thơm", "hương thơm cao cấp", "aroma"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


