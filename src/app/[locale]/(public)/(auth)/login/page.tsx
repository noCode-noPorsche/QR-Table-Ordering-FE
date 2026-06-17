import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import Logout from "@/app/[locale]/(public)/(auth)/login/logout";
import envConfig, { Locale } from "@/config";
import { htmlToTextForDescription } from "@/lib/server-utils";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "Login",
  });
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}`;

  return {
    title: t("title"),
    description: htmlToTextForDescription(t("description")),
    alternates: {
      canonical: url,
    },
  };
}

export default function Login({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense>
        <LoginForm />
        <Logout />
      </Suspense>
    </div>
  );
}
