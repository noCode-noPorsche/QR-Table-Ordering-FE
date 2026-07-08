import http from '@/lib/http'
import {
  CreateTableBodyType,
  GetTableListWithPaginationQueryType,
  GetTableListWithPaginationResType,
  TableResType,
  UpdateTableBodyType
} from '@/schemaValidations/table.schema'
import queryString from 'query-string'

const prefix = 'tables'

const tableApiRequest = {
  getTableList: (queryParams: GetTableListWithPaginationQueryType) => {
    return http.get<GetTableListWithPaginationResType>(
      `/${prefix}?` +
        queryString.stringify({
          page: queryParams.page,
          limit: queryParams.limit
        })
    )
  },
  addTable: (body: CreateTableBodyType) => http.post<TableResType>(`/${prefix}`, body),
  getTable: (id: number) => http.get<TableResType>(`/${prefix}/${id}`),
  updateTable: (id: number, body: UpdateTableBodyType) => http.put<TableResType>(`/${prefix}/${id}`, body),
  deleteTable: (id: number) => http.delete<TableResType>(`/${prefix}/${id}`)
}

export default tableApiRequest
