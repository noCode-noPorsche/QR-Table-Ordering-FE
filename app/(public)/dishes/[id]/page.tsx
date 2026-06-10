import dishApiRequest from "@/apiRequest/dish";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";

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

  if (!dish) return <div>Món ăn không tồn tại</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
      <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>

      <Image
        src={dish.image}
        width={700}
        height={700}
        quality={100}
        alt={dish.name}
        className="object-cover w-full h-full "
      />
      <p>{dish.description}</p>
    </div>
  );
}
