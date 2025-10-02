import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import styles from "./layout.module.css";
import Navbar from "../components/navbar/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/useCart";
import NavbarWithCart from "@/components/navbar/NavbarWithCart";
import { SocketProvider } from "@/providers/SocketProvider";
import Footer from "@/components/footer/Footer";
import ScrollToTop from "@/components/scroll-to-top/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Algira",
  description: "Algira",
  icons: {
    icon: "/algira.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${styles.form__container}`}
      >
        <SocketProvider>
          <AuthProvider>
            <CartProvider>
              <NavbarWithCart />
              <main className={styles.mainContent}>
                <ScrollToTop />
                {children}

                <Footer />
              </main>
            </CartProvider>
          </AuthProvider>
        </SocketProvider>
        <ToastContainer
          position="bottom-left"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
