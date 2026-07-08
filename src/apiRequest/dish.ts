import http from '@/lib/http'
import {
  CreateDishBodyType,
  DishListWithPaginationQueryType,
  DishListWithPaginationResType,
  DishResType,
  UpdateDishBodyType
} from '@/schemaValidations/dish.schema'
import queryString from 'query-string'

const prefix = 'dishes'

const dishApiRequest = {
  getDishList: (queryParams: DishListWithPaginationQueryType) =>
    http.get<DishListWithPaginationResType>(
      `/${prefix}?` +
        queryString.stringify({
          page: queryParams.page,
          limit: queryParams.limit
        }),
      { next: { tags: ['dishes'] } }
    ),
  addDish: (body: CreateDishBodyType) => http.post<DishResType>(`/${prefix}`, body),
  getDish: (id: number) => http.get<DishResType>(`/${prefix}/${id}`),
  updateDish: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`/${prefix}/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`/${prefix}/${id}`)
}

export default dishApiRequest
