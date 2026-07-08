/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
'use client'

import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import AddTable from '@/app/[locale]/manage/tables/add-table'
import EditTable from '@/app/[locale]/manage/tables/edit-table'
import AutoPagination from '@/components/auto-pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getTableLink, getVietnameseTableStatus, handleErrorApi } from '@/lib/utils'
import { TableListResType } from '@/schemaValidations/table.schema'
import { useSearchParams } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { useDeleteTableMutation, useGetTableList } from '@/queries/useTable'
import QRCodeTable from '@/components/qrcode-table'
import { toast } from 'sonner'
import TableSkeleton from '@/app/[locale]/manage/tables/table-skeleton'

type TableItem = TableListResType['data'][0]

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void
  tableIdEdit: number | undefined
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}>({
  setTableIdEdit: (value: number | undefined) => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: (value: TableItem | null) => {}
})

export const getColumns = (page: number): ColumnDef<TableItem>[] => [
  {
    id: 'stt',
    header: 'STT',
    cell: ({ row }) => {
      const stt = (page - 1) * PAGE_SIZE + row.index + 1
      return <div>{stt}</div>
    }
  },
  {
    accessorKey: 'number',
    header: 'Số bàn',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('number')}</div>,
    filterFn: (rows, columnId, filterValue) => {
      if (!filterValue) return true

      return String(filterValue) === String(rows.getValue('number'))
    }
  },
  {
    accessorKey: 'capacity',
    header: 'Sức chứa',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('capacity')}</div>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue('status'))}</div>
  },
  {
    accessorKey: 'token',
    header: 'QR Code',
    cell: ({ row }) => (
      <div>
        <QRCodeTable tableNumber={row.getValue('number')} token={row.getValue('token')} />
      </div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = useContext(TableTableContext)
      const openEditTable = () => {
        setTableIdEdit(row.original.number)
      }

      const openDeleteTable = () => {
        setTableDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Mở menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete
}: {
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}) {
  const { mutateAsync } = useDeleteTableMutation()
  const deleteTable = async () => {
    if (tableDelete) {
      try {
        const result = await mutateAsync(tableDelete.number)
        setTableDelete(null)
        toast(result.payload.message)
      } catch (error) {
        handleErrorApi({ error })
      }
    }
  }

  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn <span className='bg-foreground text-primary-foreground rounded px-1'>{tableDelete?.number}</span> sẽ bị
            xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTable}>Tiếp tục</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function TableTable() {
  const searchParam = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>()
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null)

  const tableListQuery = useGetTableList({
    page,
    limit: PAGE_SIZE
  })
  const data = tableListQuery.data?.payload.data.items ?? []
  const totalItem = tableListQuery.data?.payload.data.totalItem || 0
  const totalPage = tableListQuery.data?.payload.data.totalPage || 1

  const currentRecord = Math.min(page * PAGE_SIZE, totalItem)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const columns = getColumns(page)
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    // BẬT MANUAL PAGINATION (Báo cho table biết Server sẽ handle việc chia trang)
    manualPagination: true,
    rowCount: totalItem, // Cung cấp tổng số item toàn bộ hệ thống để tính toán nút bấm
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  // useEffect(() => {
  //   table.setPagination({
  //     pageIndex,
  //     pageSize: PAGE_SIZE
  //   })
  // }, [table, pageIndex])

  return (
    <TableTableContext.Provider value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}>
      <div className='w-full'>
        <EditTable id={tableIdEdit} setId={setTableIdEdit} />
        <AlertDialogDeleteTable tableDelete={tableDelete} setTableDelete={setTableDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc số bàn'
            value={(table.getColumn('number')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('number')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='ml-auto flex items-center gap-2'>
            <AddTable />
          </div>
        </div>
        {tableListQuery.isPending ? (
          <TableSkeleton />
        ) : (
          <>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center'>
                        Không có kết quả.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
              <div className='text-xs text-muted-foreground py-4 flex-1 '>
                Hiển thị <strong>{currentRecord}</strong> trong <strong>{totalItem}</strong> kết quả
              </div>
              <div>
                <AutoPagination page={page} pageSize={totalPage} pathname='/manage/tables' />
              </div>
            </div>
          </>
        )}
      </div>
    </TableTableContext.Provider>
  )
}
