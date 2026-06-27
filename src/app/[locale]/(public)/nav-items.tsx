'use client'

import { useAppStore } from '@/components/app-provider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Role } from '@/constants/type'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useGuestLogoutMutation } from '@/queries/useGuest'
import { RoleType } from '@/types/jwt.types'
import { useTranslations } from 'next-intl'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
}[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Orders',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Login',
    href: '/login',
    hideWhenLogin: true
  },
  {
    title: 'Manage',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const setRole = useAppStore((state) => state.setRole)
  const role = useAppStore((state) => state.role)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const router = useRouter()
  const t = useTranslations('NavItem')

  const authLogout = useLogoutMutation()
  const guestLogout = useGuestLogoutMutation()

  const logoutMutation = role !== Role.Guest ? authLogout : guestLogout

  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      disconnectSocket()
      router.push('/')
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role)

        // Trường hợp menu có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow = (item.role === undefined && !item.hideWhenLogin) || (!role && item.hideWhenLogin)

        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title.toLowerCase() as any)}
            </Link>
          )
        }
        return null
      })}

      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>{t('logout')}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('logoutDialog.logoutQuestion')}</AlertDialogTitle>
              <AlertDialogDescription>{t('logoutDialog.logoutDescription')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('logoutDialog.logoutCancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
