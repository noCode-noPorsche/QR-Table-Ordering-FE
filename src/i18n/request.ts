import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Ngôn ngữ website
  // Cái giá trị locale có thể lấy từ cookie người dùng chẳng hạn

  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale: locale!,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
