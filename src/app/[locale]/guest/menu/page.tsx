import MenuOrder from '@/app/[locale]/guest/menu/menu-order'
import envConfig, { Locale } from '@/config'
import { baseOpenGraph } from '@/share-metadata'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params
  // searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale,
    namespace: 'GuestMenu'
  })

  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/guest/menu`

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      ...baseOpenGraph,
      title: t('title'),
      description: t('description'),
      url
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default async function MenuPage() {
  return (
    <div className='max-w-100 mx-auto space-y-4'>
      <h1 className='text-center text-xl font-bold'>🍕 Menu quán</h1>
      <MenuOrder />
    </div>
  )
}
