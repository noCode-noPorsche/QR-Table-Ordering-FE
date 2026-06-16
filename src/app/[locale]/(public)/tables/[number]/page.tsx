import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import envConfig, { Locale } from "@/config";
import { baseOpenGraph } from "@/share-metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: Locale; number: number }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  // searchParams,
}: Props): Promise<Metadata> {
  const { locale, number } = await params;
  const t = await getTranslations({
    locale,
    namespace: "LoginGuest",
  });

  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/tables/${number}`;

  return {
    title: `No ${number} | ${t("title")}`,
    description: t("description"),
    openGraph: {
      ...baseOpenGraph,
      title: `No ${number} | ${t("title")}`,
      description: t("description"),
      url,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
    },
  };
}

export default function TableNumberPage() {
  return <GuestLoginForm />;
}
