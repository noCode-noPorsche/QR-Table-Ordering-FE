import OAuth from "@/app/[locale]/(public)/(auth)/login/oauth/oauth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Google Login Redirect",
  description: "Google Login Redirect",
  robots: {
    index: false,
  },
};

export default function OAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuth />
    </Suspense>
  );
}
