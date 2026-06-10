import http from "@/src/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/src/schemaValidations/dish.schema";

const prefix = "dishes";

const dishApiRequest = {
  getDishList: () =>
    http.get<DishListResType>(`/${prefix}`, { next: { tags: ["dishes"] } }),
  addDish: (body: CreateDishBodyType) =>
    http.post<DishResType>(`/${prefix}`, body),
  getDish: (id: number) => http.get<DishResType>(`/${prefix}/${id}`),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/${prefix}/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`/${prefix}/${id}`),
};

export default dishApiRequest;
