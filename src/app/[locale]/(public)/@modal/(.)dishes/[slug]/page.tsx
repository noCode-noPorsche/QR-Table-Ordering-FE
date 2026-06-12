import dishApiRequest from "@/apiRequest/dish";
import Modal from "@/app/[locale]/(public)/@modal/(.)dishes/[slug]/modal";
import DishDetailPage from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";

type DishPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DishPage({ params }: DishPageProps) {
  const { slug } = await params;
  console.log(slug);
  const id = getIdFromSlugUrl(slug);
  console.log(id);

  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;

  return (
    <Modal>
      <DishDetailPage params={Promise.resolve({ dish })} />
    </Modal>
  );
}
