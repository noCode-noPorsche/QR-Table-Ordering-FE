import envConfig from '@/config'

export const baseOpenGraph = {
  locale: 'en_US',
  alternateLocale: ['vi_VN'],
  type: 'website',
  siteName: 'Big boy Restaurant',
  image: [
    {
      url: `${envConfig.NEXT_PUBLIC_URL}/banner.png`
    }
  ]
}
