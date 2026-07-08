import { Skeleton } from '@/components/ui/skeleton'

export function MenuSkeleton() {
  // Tạo mảng ảo với 6 item để mô phỏng chiều dài menu trong ảnh
  const skeletonItems = Array.from({ length: 6 })

  return (
    <div className='p-4 space-y-6'>
      {skeletonItems.map((_, index) => (
        <div key={index} className='flex items-center gap-4'>
          {/* 1. Số thứ tự (Placeholder) */}
          <div className='flex items-center justify-center w-6'>
            <Skeleton className='h-4 w-4 rounded' />
          </div>

          {/* 2. Ô vuông hình ảnh (Mô phỏng w-20 h-20) */}
          <div className='w-20 h-20 shrink-0'>
            <Skeleton className='w-full h-full rounded-md' />
          </div>

          {/* 3. Nội dung văn bản (Flex-1 để chiếm không gian còn lại) */}
          <div className='flex-1 space-y-2.5'>
            {/* Tên món */}
            <Skeleton className='h-4 w-3/4 rounded' />
            {/* Mô tả (2 dòng) */}
            <div className='space-y-1.5'>
              <Skeleton className='h-3 w-full rounded' />
              <Skeleton className='h-3 w-2/3 rounded' />
            </div>
            {/* Giá */}
            <Skeleton className='h-4 w-1/4 rounded' />
          </div>

          {/* 4. Cụm nút Số lượng (Ở góc phải, mô phỏng nút + - và số 0) */}
          <div className='shrink-0 ml-auto flex items-center gap-3'>
            <Skeleton className='h-8 w-8 rounded-full' /> {/* Nút Trừ */}
            <Skeleton className='h-5 w-6 rounded' /> {/* Số 0 */}
            <Skeleton className='h-8 w-8 rounded-full' /> {/* Nút Cộng */}
          </div>
        </div>
      ))}
    </div>
  )
}
