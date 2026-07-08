import { Skeleton } from '@/components/ui/skeleton'

export default function OrderSkeleton() {
  // Tạo 5 hàng giả lập để nhìn giống danh sách đang tải
  const skeletonRows = Array.from({ length: 5 })

  return (
    <div className='w-full overflow-auto space-y-4 p-2'>
      {/* 1. Header của Table */}
      <div className='flex items-center text-sm font-medium border-b pb-3 text-muted-foreground min-w-200'>
        <div className='w-[8%]'>Bàn</div>
        <div className='w-[15%]'>Khách hàng</div>
        <div className='w-[27%]'>Món ăn</div>
        <div className='w-[15%]'>Trạng thái</div>
        <div className='w-[15%]'>Người xử lý</div>
        <div className='w-[16%]'>Tạo/Cập nhật</div>
        <div className='w-[4%] text-right'></div>
      </div>

      {/* 2. Danh sách các hàng dữ liệu (Rows) */}
      <div className='space-y-4 min-w-200'>
        {skeletonRows.map((_, index) => (
          <div key={index} className='flex items-center py-2 border-b border-dashed last:border-0'>
            {/* Cột 1: Bàn */}
            <div className='w-[8%]'>
              <Skeleton className='h-5 w-6 rounded' />
            </div>

            {/* Cột 2: Khách hàng */}
            <div className='w-[15%]'>
              <Skeleton className='h-5 w-20 rounded' />
            </div>

            {/* Cột 3: Món ăn (Avatar tròn + Tên/Giá) */}
            <div className='w-[27%] flex items-center gap-3'>
              <Skeleton className='h-10 w-10 shrink-0 rounded-md' /> {/* Ô ảnh món ăn */}
              <div className='space-y-1.5 flex-1'>
                <Skeleton className='h-4 w-3/4 rounded' /> {/* Tên món */}
                <Skeleton className='h-3.5 w-1/3 rounded' /> {/* Giá tiền */}
              </div>
            </div>

            {/* Cột 4: Trạng thái (Mô phỏng nút Select dropdown) */}
            <div className='w-[15%]'>
              <Skeleton className='h-9 w-28 rounded-md' />
            </div>

            {/* Cột 5: Người xử lý */}
            <div className='w-[15%]'>
              {/* Giả lập hàng có người xử lý, hàng không có */}
              {index % 2 === 0 ? <Skeleton className='h-4 w-12 rounded' /> : <div />}
            </div>

            {/* Cột 6: Tạo/Cập nhật (2 dòng thời gian như UI) */}
            <div className='w-[16%] space-y-1.5'>
              <Skeleton className='h-3.5 w-32 rounded' />
              <Skeleton className='h-3.5 w-32 rounded' />
            </div>

            {/* Cột 7: Nút ba chấm (...) ở cuối */}
            <div className='w-[4%] flex justify-end'>
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
