import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import styles from "./layout.module.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/useCart";
import NavbarWithCart from "@/components/navbar/NavbarWithCart";
import { SocketProvider } from "@/providers/SocketProvider";
import Footer from "@/components/footer/Footer";
import ScrollToTop from "@/components/scroll-to-top/ScrollToTop";
import ToTop from "@/components/to-top/ToTop";
import { HighlightRaffleProvider } from "@/context/HighlightRaffleContext";

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
      <body className={`${styles.form__container}`}>
        <SocketProvider>
          <AuthProvider>
            <CartProvider>
              <HighlightRaffleProvider>
                <NavbarWithCart />
                <main className={styles.mainContent}>
                  <ScrollToTop />
                  <ToTop />
                  {children}

                  <Footer />
                </main>
              </HighlightRaffleProvider>
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
