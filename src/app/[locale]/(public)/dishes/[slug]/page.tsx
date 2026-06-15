import dishApiRequest from "@/apiRequest/dish";
import DishDetailPage from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import envConfig, { Locale } from "@/config";
import { generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import { baseOpenGraph } from "@/share-metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cache } from "react";

const getDetail = cache((id: number) =>
  wrapServerApi(() => dishApiRequest.getDish(id)),
);

type Props = {
  params: { slug: string; locale: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  params,
  // searchParams,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({
    locale: locale,
    namespace: "DishDetail",
  });

  const id = getIdFromSlugUrl(slug);
  const data = await getDetail(id);
  const dish = data?.payload.data;

  if (!dish) {
    return {
      title: t("notFound"),
      description: t("notFound"),
    };
  }

  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/${params.locale}/dishes/${generateSlugUrl({
      name: dish.name,
      id: dish.id,
    })}`;

  return {
    title: dish.name,
    description: dish.description,
    openGraph: {
      ...baseOpenGraph,
      title: dish.name,
      description: dish.description,
      url,
      images: [
        {
          url: dish.image,
        },
      ],
    },
    alternates: {
      canonical: url,
    },
  };
}

type DishPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DishPage({ params }: DishPageProps) {
  const { slug } = await params;
  const id = getIdFromSlugUrl(slug);

  const data = await getDetail(id);
  const dish = data?.payload.data;

  if (!dish) return <div>Món ăn không tồn tại</div>;
  return <DishDetailPage params={Promise.resolve({ dish })} />;
}
