"use client";

import { Suspense } from "react";
import Loader from "@/components/loader/Loader";
import CartSidebar from "./CartSidebar";

export default function CartSidebarWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <CartSidebar />
    </Suspense>
  );
}
