import dishApiRequest from "@/apiRequest/dish";
import Modal from "@/app/[locale]/(public)/@modal/(.)dishes/[id]/modal";
import DishDetailPage from "@/app/[locale]/(public)/dishes/[id]/dish-detail";
import { wrapServerApi } from "@/lib/utils";

type DishPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DishPage({ params }: DishPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;

  return (
    <Modal>
      <DishDetailPage params={Promise.resolve({ dish })} />
    </Modal>
  );
}
