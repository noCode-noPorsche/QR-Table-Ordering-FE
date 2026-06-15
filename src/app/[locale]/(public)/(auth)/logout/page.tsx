import Logout from "@/app/[locale]/(public)/(auth)/logout/page";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Logout Redirect",
  description: "Logout redirect",
  robots: {
    index: false,
  },
};

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}
