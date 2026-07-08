import { Skeleton } from '@/components/ui/skeleton'

export default function DishSkeleton() {
  // Tạo 5 hàng giả lập để nhìn giống danh sách đang tải
  const skeletonRows = Array.from({ length: 5 })

  return (
    <div className='w-full overflow-auto space-y-4 p-2'>
      {/* 1. Header của Table */}
      <div className='flex items-center text-sm font-medium border-b pb-3 text-muted-foreground min-w-200'>
        <div className='w-[8%]'>STT</div>
        <div className='w-[8%]'>ID</div>
        <div className='w-[20%]'>Ảnh</div>
        <div className='w-[20%]'>Tên</div>
        <div className='w-[10%]'>Giá cả</div>
        <div className='w-[20%]'>Mô tả</div>
        <div className='w-[10%]'>Trạng thái</div>
        <div className='w-[4%] text-right'></div>
      </div>

      {/* 2. Danh sách các hàng dữ liệu (Rows) */}
      <div className='space-y-4 min-w-200'>
        {skeletonRows.map((_, index) => (
          <div key={index} className='flex items-center py-2 border-b border-dashed last:border-0'>
            {/* Cột 1: STT */}
            <div className='w-[8%]'>
              <Skeleton className='h-5 w-6 rounded' />
            </div>

            {/* Cột 2: ID */}
            <div className='w-[8%]'>
              <Skeleton className='h-5 w-5 rounded' />
            </div>

            {/* Cột 3: Ảnh */}
            <div className='w-[20%]'>
              <Skeleton className='w-40 h-40 rounded' />
            </div>

            {/* Cột 4: Tên món */}
            <div className='w-[20%]'>
              <Skeleton className='h-5 w-20 rounded' />
            </div>

            {/* Cột 5: Giá cả */}
            <div className='w-[10%]'>
              <Skeleton className='h-5 w-20 rounded-md' />
            </div>

            {/* Cột 6: Mô tả */}
            <div className='w-[20%]'>
              <Skeleton className='h-5 w-20 rounded' />
            </div>

            {/* Cột 7: Trạng thái */}
            <div className='w-[10%]'>
              <Skeleton className='h-5 w-20 rounded' />
            </div>

            {/* Cột 8: Nút ba chấm (...) ở cuối */}
            <div className='w-[4%]'>
              <Skeleton className='h-4 w-4 rounded-full' />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Phần Pagination giả lập ở dưới cùng */}
      <div className='flex items-center justify-between pt-2 min-w-200'>
        <Skeleton className='h-4 w-32 rounded' />
        <div className='flex gap-1'>
          <Skeleton className='h-8 w-16 rounded' />
          <Skeleton className='h-8 w-8 rounded' />
          <Skeleton className='h-8 w-16 rounded' />
        </div>
      </div>
    </div>
  )
}
