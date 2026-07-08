import { TableStatusValues } from '@/constants/type'
import z from 'zod'

export const CreateTableBody = z.object({
  number: z.coerce.number().positive(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional()
})

export type CreateTableBodyType = z.TypeOf<typeof CreateTableBody>

export const TableSchema = z.object({
  number: z.coerce.number(),
  capacity: z.coerce.number(),
  status: z.enum(TableStatusValues),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const TableRes = z.object({
  data: TableSchema,
  message: z.string()
})

export type TableResType = z.TypeOf<typeof TableRes>

export const TableListRes = z.object({
  data: z.array(TableSchema),
  message: z.string()
})

export type TableListResType = z.TypeOf<typeof TableListRes>

export const UpdateTableBody = z.object({
  changeToken: z.boolean(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional()
})
export type UpdateTableBodyType = z.TypeOf<typeof UpdateTableBody>
export const TableParams = z.object({
  number: z.coerce.number()
})
export type TableParamsType = z.TypeOf<typeof TableParams>

export const GetTableListWithPaginationQuery = z.object({
  page: z.coerce.number().positive().lte(10000).default(1),
  limit: z.coerce.number().positive().lte(10000).default(10)
})

export type GetTableListWithPaginationQueryType = z.TypeOf<typeof GetTableListWithPaginationQuery>

export const GetTableListWithPaginationRes = z.object({
  data: z.object({
    totalItem: z.number(),
    totalPage: z.number(),
    page: z.number(),
    limit: z.number(),
    items: z.array(TableSchema)
  }),
  message: z.string()
})

export type GetTableListWithPaginationResType = z.TypeOf<typeof GetTableListWithPaginationRes>
