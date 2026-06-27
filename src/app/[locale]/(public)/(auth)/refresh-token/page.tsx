// import { Metadata } from "next";
import RefreshToken from '@/app/[locale]/(public)/(auth)/refresh-token/refresh-token'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Refresh Token Redirect',
  description: 'Refresh token redirect',
  robots: {
    index: false
  }
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  )
}
