'use client'

import { useAppStore } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import envConfig from '@/config'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useLoginMutation } from '@/queries/useAuth'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@/i18n/navigation'
// import { useSearchParams } from "next/navigation";
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import SearchParamsLoader, { useSearchParamsLoader } from '@/components/search-params-loader'
import { useTranslations } from 'next-intl'
import { LoaderCircle } from 'lucide-react'

export default function LoginForm() {
  const loginMutation = useLoginMutation()
  const router = useRouter()
  const t = useTranslations('Login')
  const errorMessageT = useTranslations('ErrorMessage')
  // const searchParams = useSearchParams();
  const { searchParams, setSearchParams } = useSearchParamsLoader()
  const clearToken = searchParams?.get('clearToken')
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return
    try {
      const result = await loginMutation.mutateAsync(data)
      toast.success(result.payload.message)
      router.push('/manage/dashboard')
      setRole(result.payload.data.account.role)
      setSocket(generateSocketInstance(result.payload.data.accessToken))
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const getOauthGoogleUrl = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = {
      redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
      client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' ')
    }
    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
  }
  const googleOauthUrl = getOauthGoogleUrl()

  useEffect(() => {
    if (clearToken) {
      setRole(undefined)
    }
  }, [router, setRole, clearToken])

  return (
    <div className='flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4 md:p-6  from-background to-muted/20'>
      <Card className='w-full max-w-md shadow-xl border-muted/40 backdrop-blur-sm bg-card/90'>
        <SearchParamsLoader onParamReceived={setSearchParams} />
        <CardHeader className='space-y-1 text-center md:text-center'>
          <CardTitle className='text-2xl font-bold tracking-tight'>{t('title')}</CardTitle>
          <CardDescription className='text-balance'>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (err) => {
                console.warn(err)
              })}
              className='space-y-4'
              noValidate
            >
              <div className='grid gap-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <div className='grid gap-1.5'>
                        <Label htmlFor='email' className='text-sm font-medium'>
                          {t('email')}
                        </Label>
                        <Input
                          id='email'
                          type='email'
                          placeholder='name@example.com'
                          className='h-10'
                          autoComplete='email'
                          {...field}
                        />
                        <FormMessage className='text-xs'>
                          {Boolean(errors.email?.message) && errorMessageT(errors.email?.message as any)}
                        </FormMessage>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <div className='grid gap-1.5'>
                        <div className='flex items-center justify-between'>
                          <Label htmlFor='password' className='text-sm font-medium'>
                            {t('password')}
                          </Label>
                          <a href='#' className='text-xs text-primary hover:underline font-medium'>
                            {t('forgotPassword')}
                          </a>
                        </div>
                        <Input
                          id='password'
                          type='password'
                          placeholder='••••••••'
                          className='h-10'
                          autoComplete='current-password'
                          {...field}
                        />
                        <FormMessage className='text-xs'>
                          {Boolean(errors.password?.message) && errorMessageT(errors.password?.message as any)}
                        </FormMessage>
                      </div>
                    </FormItem>
                  )}
                />

                <div className='space-y-2.5 pt-2'>
                  <Button
                    type='submit'
                    className='w-full h-10 font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer'
                  >
                    {loginMutation.isPending && <LoaderCircle className='animate-spin' />}
                    {t('signIn')}
                  </Button>
                  <div className='relative flex items-center justify-center my-2'>
                    <span className='absolute w-full border-t border-muted' />
                    <span className='relative bg-card px-3 text-xs uppercase text-muted-foreground font-medium'>
                      {t('orContinueWithGoogle')}
                    </span>
                  </div>
                  <Link href={googleOauthUrl}>
                    <Button
                      variant='outline'
                      className='w-full h-10 font-medium hover:bg-muted/50 transition-colors cursor-pointer'
                      type='button'
                    >
                      <svg className='mr-2 h-4 w-full max-w-4' viewBox='0 0 24 24'>
                        <path
                          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                          fill='#4285F4'
                        />
                        <path
                          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                          fill='#34A853'
                        />
                        <path
                          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
                          fill='#FBBC05'
                        />
                        <path
                          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
                          fill='#EA4335'
                        />
                      </svg>
                      Google
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
