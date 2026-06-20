import { LayoutDashboard, BookOpen, Settings } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, end: true },
  { label: 'My Books', path: ROUTES.BOOKS, icon: BookOpen },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
]