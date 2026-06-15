import { formatCurrency } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";

type DishPageProps = {
  params: Promise<{
    dish: DishResType["data"] | undefined;
  }>;
};

export default async function DishDetailPage({ params }: DishPageProps) {
  const dish = (await params).dish;
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
        className="object-cover w-full h-full"
        title={dish.name}
      />
      <p>{dish.description}</p>
    </div>
  );
}
