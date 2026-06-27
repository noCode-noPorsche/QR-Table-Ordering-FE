import Script from 'next/script'
import React, { Fragment } from 'react'

export default function GoogleTag() {
  return (
    <Fragment>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-T01NE30SCT' />
      <Script
        id='gtag-init'
        dangerouslySetInnerHTML={{
          __html: ` 
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-T01NE30SCT');`
        }}
      />
    </Fragment>
  )
}
