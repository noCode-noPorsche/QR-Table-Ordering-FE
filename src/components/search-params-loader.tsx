'use client'

import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

type SearchParamsLoaderProps = {
  onParamReceived: (params: ReadonlyURLSearchParams) => void
}

function Suspender(props: SearchParamsLoaderProps) {
  return (
    <Suspense>
      <Suspended {...props} />
    </Suspense>
  )
}

function Suspended({ onParamReceived }: SearchParamsLoaderProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    onParamReceived(searchParams)
  }, [searchParams, onParamReceived])
  return null
}

const SearchParamsLoader = React.memo(Suspender)

export default SearchParamsLoader

export const useSearchParamsLoader = () => {
  const [searchParams, setSearchParams] = React.useState<ReadonlyURLSearchParams | null>(null)
  return {
    searchParams,
    setSearchParams
  }
}
