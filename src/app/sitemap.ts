import dishApiRequest from '@/apiRequest/dish'
import envConfig, { locales } from '@/config'
import { generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import type { MetadataRoute } from 'next'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: '',
    changeFrequency: 'daily',
    priority: 1
  },
  {
    url: '/login',
    changeFrequency: 'yearly',
    priority: 0.5
  }
]

const PAGE = 1
const LIMIT = 1000
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dishList: DishListResType['data'] = []
  try {
    const result = await dishApiRequest.getDishList({
      page: PAGE,
      limit: LIMIT
    })
    dishList = result.payload.data.items ?? []
  } catch (error) {
    console.warn('⚠️ Cảnh báo: Không thể kết nối Backend để lấy danh sách món ăn cho sitemap lúc build.', error)
  }

  const localizeStaticSiteMap = locales.reduce((acc, locale) => {
    return [
      ...acc,
      ...staticRoutes.map((route) => {
        return {
          ...route,
          url: `${envConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
          lastModified: new Date()
        }
      })
    ]
  }, [] as MetadataRoute.Sitemap)

  const localizeDishSiteMap = locales.reduce((acc, locale) => {
    const dishListSiteMap: MetadataRoute.Sitemap = dishList.map((dish) => {
      return {
        url: `${envConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl({
          name: dish.name,
          id: dish.id
        })}`,
        lastModified: dish.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9
      }
    })
    return [...acc, ...dishListSiteMap]
  }, [] as MetadataRoute.Sitemap)

  return [...localizeDishSiteMap, ...localizeStaticSiteMap]
}
