"use client";

import Navbar from "@/components/navbar/Navbar";
import CartSidebar from "../cartSidebar/CartSidebar";

export default function NavbarWithCart() {
  return (
    <>
      <Navbar />
      <CartSidebar />
    </>
  );
}
