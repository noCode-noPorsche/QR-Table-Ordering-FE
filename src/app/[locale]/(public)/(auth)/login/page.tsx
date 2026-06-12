import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export default function Login({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
