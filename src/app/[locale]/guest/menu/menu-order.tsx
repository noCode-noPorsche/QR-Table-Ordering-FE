'use client'

import { MenuSkeleton } from '@/app/[locale]/guest/menu/menu-skeleton'
import Quantity from '@/app/[locale]/guest/menu/quantity'
import { Button } from '@/components/ui/button'
import { DishStatus } from '@/constants/type'
import { useRouter } from '@/i18n/navigation'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { useGetDishList } from '@/queries/useDish'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Image from 'next/image'
import { useState } from 'react'

const PAGE = 1
const LIMIT = 100
export default function MenuOrder() {
  const { mutateAsync, isPending } = useGuestOrderMutation()
  const { data, isPending: isPendingGetDishList } = useGetDishList({ page: PAGE, limit: LIMIT })
  const dishes = data?.payload.data.items ?? []
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const router = useRouter()

  const totalPrice = dishes.reduce((result, dish) => {
    const order = orders.find((order) => order.dishId === dish.id)
    if (!order) return result
    return result + order.quantity * dish.price
  }, 0)

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }

      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }

      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }

      return newOrders
    })
  }

  const handleOrder = async () => {
    try {
      await mutateAsync(orders)
      router.push('/guest/orders')
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {isPendingGetDishList ? (
        <MenuSkeleton />
      ) : (
        dishes
          .filter((dist) => dist.status !== DishStatus.Hidden)
          .map((dish, index) => (
            <div
              key={dish.id}
              className={cn('flex gap-4', {
                'pointer-events-none': dish.status === DishStatus.Unavailable
              })}
            >
              <div className='text-sm font-semibold'>{index + 1}</div>
              <div className='shrink-0 relative'>
                {dish.status === DishStatus.Unavailable && (
                  <span className='absolute inset-0 text-sm flex items-center justify-center'>Hết hàng</span>
                )}
                <Image
                  src={dish.image}
                  alt={dish.name}
                  height={100}
                  width={100}
                  quality={100}
                  className='object-cover w-20 h-20 rounded-md'
                  unoptimized={process.env.NEXT_PUBLIC_PRODUCTION === 'true' ? false : true}
                />
              </div>
              <div className='space-y-1'>
                <h3 className='text-sm'>{dish.name}</h3>
                <p className='text-xs'>{dish.description}</p>
                <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
              </div>
              <div className='shrink-0 ml-auto flex justify-center items-center'>
                <Quantity
                  onChange={(value) => handleQuantityChange(dish.id, value)}
                  value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                />
              </div>
            </div>
          ))
      )}
      <div className='sticky bottom-0'>
        <Button
          className='w-full justify-between cursor-pointer'
          onClick={handleOrder}
          disabled={orders.length === 0 || isPending}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
