import dishApiRequest from '@/apiRequest/dish'
import DishDetailPage from '@/app/[locale]/(public)/dishes/[slug]/dish-detail'
import envConfig, { Locale } from '@/config'
import { htmlToTextForDescription } from '@/lib/server-utils'
import { generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from '@/lib/utils'
import { baseOpenGraph } from '@/share-metadata'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'

const getDetail = cache((id: number) => wrapServerApi(() => dishApiRequest.getDish(id)))

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params
  // searchParams,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({
    locale: locale,
    namespace: 'DishDetail'
  })

  const id = getIdFromSlugUrl(slug)
  const data = await getDetail(id)
  const dish = data?.payload.data

  if (!dish) {
    return {
      title: t('notFound'),
      description: t('notFound')
    }
  }

  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/${locale}/dishes/${generateSlugUrl({
      name: dish.name,
      id: dish.id
    })}`

  return {
    title: dish.name,
    description: htmlToTextForDescription(dish.description),
    openGraph: {
      ...baseOpenGraph,
      title: dish.name,
      description: dish.description,
      url,
      images: [
        {
          url: dish.image
        }
      ]
    },
    alternates: {
      canonical: url
    }
  }
}

type DishPageProps = {
  params: Promise<{
    slug: string
  }>
}

const PAGE = 1
const LIMIT = 10000
export async function generateStaticParams() {
  try {
    const result = await dishApiRequest.getDishList({ page: PAGE, limit: LIMIT })
    const dishList = result.payload.data.items

    // Trả về danh sách slug để Next.js render sẵn thành file tĩnh ký hiệu chấm tròn đầy (●)
    return dishList.map((dish) => ({
      slug: generateSlugUrl({
        name: dish.name,
        id: dish.id
      })
    }))
  } catch (error) {
    // Nếu Backend đang tắt, in log cảnh báo nhẹ và trả về mảng rỗng để Next.js vượt qua không bị treo
    console.warn('⚠️ Cảnh báo: Không thể kết nối Backend để tạo SSG cho trang chi tiết món ăn.', error)
    return []
  }
}

export default async function DishPage({ params }: DishPageProps) {
  const { slug } = await params
  const id = getIdFromSlugUrl(slug)

  const data = await getDetail(id)
  const dish = data?.payload.data

  if (!dish) return <div>Món ăn không tồn tại</div>
  return <DishDetailPage params={Promise.resolve({ dish })} />
}
