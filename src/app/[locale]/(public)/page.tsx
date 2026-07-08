import dishApiRequest from '@/apiRequest/dish'
import { formatCurrency, generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import envConfig, { Locale } from '@/config'
import { Metadata } from 'next'
import { htmlToTextForDescription } from '@/lib/server-utils'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'HomePage'
  })
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}`

  return {
    title: t('title'),
    description: htmlToTextForDescription(t('description')),
    alternates: {
      canonical: url
    }
  }
}

type HomeProps = {
  params: Promise<{
    locale: Locale
  }>
}

const PAGE = 1
const LIMIT = 10000
export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('HomePage')

  let dishList: DishListResType['data'] = []
  try {
    const result = await dishApiRequest.getDishList({ page: PAGE, limit: LIMIT })
    const {
      payload: { data }
    } = result
    dishList = data.items
  } catch (e) {
    console.log(e)
    return <div>Something went wrong</div>
  }

  return (
    <div className='w-full space-y-4'>
      <section className='relative z-10'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10'></span>
        <Image
          src='/banner.png'
          width={400}
          height={200}
          quality={100}
          alt='Banner'
          priority
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
          <h1 className='text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold'>{t('title')}</h1>
          <p className='text-center text-sm sm:text-base mt-4'>{t('slogan')}</p>
        </div>
      </section>
      <section className='space-y-10 py-16'>
        <h2 className='text-center text-2xl font-bold'>{t('h2')}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {dishList.map((dish) => (
            <Link key={dish.id} href={`/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`}>
              <div className='flex gap-4'>
                <div className='shrink-0'>
                  <Image
                    title={dish.name}
                    src={dish.image}
                    width={150}
                    height={150}
                    quality={100}
                    className='object-cover w-37.5 h-37.5 rounded-md'
                    alt={dish.name}
                    unoptimized={process.env.NEXT_PUBLIC_PRODUCTION === 'true' ? false : true}
                  />
                </div>
                <div className='space-y-1'>
                  <h3 className='text-xl font-semibold'>{dish.name}</h3>
                  <p className=''>{dish.description}</p>
                  <p className='font-semibold'>{formatCurrency(dish.price)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
