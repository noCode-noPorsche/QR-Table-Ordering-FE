import AppProvider from '@/components/app-provider'
import Footer from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { routing, generateStaticParams } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { baseOpenGraph } from '@/share-metadata'
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Inter as FontSans } from 'next/font/google'
import { notFound } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import GoogleTag from '@/components/google-tag'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

// export const metadata: Metadata = {
//   title: "Big Boy Restaurant",
//   description: "The best restaurant in the world",
// };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Brand' })

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('defaultTitle')
    },
    openGraph: {
      ...baseOpenGraph
    }
  }
}

export { generateStaticParams }

type LayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)
  const message = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextIntlClientProvider messages={message}>
          <NextTopLoader showSpinner={false} color='var(--muted-foreground)' />
          <AppProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              {children}
              <Footer />
              <Toaster position='top-right' />
            </ThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
        <GoogleTag />
      </body>
    </html>
  )
}
