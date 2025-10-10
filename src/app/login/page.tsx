"use client";

import { Suspense } from "react";
import Loader from "@/components/loader/Loader";
import Login from "./Login";

export default function LoginWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <Login />
    </Suspense>
  );
}
