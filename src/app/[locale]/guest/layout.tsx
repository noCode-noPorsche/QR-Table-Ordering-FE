import Layout from "@/app/[locale]/(public)/layout";
import { defaultLocale } from "@/config";
import React from "react";

const PublicLayout = Layout as unknown as React.ComponentType<{
  children: React.ReactNode;
  modal: null;
  params: { locale: string };
}>;

export default function GuestLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PublicLayout modal={null} params={{ locale: defaultLocale }}>
      {children}
    </PublicLayout>
  );
}
