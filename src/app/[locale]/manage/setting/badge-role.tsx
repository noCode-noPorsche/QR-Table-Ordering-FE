'use client'

import { useAppStore } from '@/components/app-provider'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

export default function BadgeRole() {
  const t = useTranslations('Role')
  const role = useAppStore((state) => state.role)

  return (
    <Badge variant='outline' className='ml-auto sm:ml-0'>
      Vai trò: {t(role === 'Owner' ? 'Owner' : role === 'Employee' ? 'Employee' : 'Guest')}
    </Badge>
  )
}
