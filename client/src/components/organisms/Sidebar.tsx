import { NavLink } from 'react-router-dom'
import { LayoutGrid, BarChart2, Tag, LogOut, CreditCard, TrendingUp } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User
  onSignOut: () => void
  onOpenCategories: () => void
  onClose?: () => void
}

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Planilha', end: true },
  { to: '/dashboard', icon: BarChart2, label: 'Dashboard', end: false },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', end: false },
  { to: '/cartoes', icon: CreditCard, label: 'Cartões', end: false },
]

export function Sidebar({ user, onSignOut, onOpenCategories, onClose }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-wise-light-surface bg-white">
      <div className="px-5 py-6 border-b border-wise-light-surface">
        <span
          className="font-black text-wise-black"
          style={{ fontSize: '22px', lineHeight: '0.85', fontFeatureSettings: '"calt"' }}
        >
          Finanças
        </span>
        <div
          className="w-8 h-1 bg-wise-green rounded-full mt-2"
        />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[16px] text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-wise-black text-white'
                  : 'text-wise-warm-dark hover:bg-[rgba(211,242,192,0.4)]'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <button
          onClick={() => { onOpenCategories(); onClose?.() }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[16px] text-sm font-semibold text-wise-warm-dark hover:bg-[rgba(211,242,192,0.4)] transition-colors text-left w-full"
        >
          <Tag size={16} />
          Categorias
        </button>
      </nav>

      <div className="px-4 py-4 border-t border-wise-light-surface flex flex-col gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-semibold text-wise-black truncate">{user.email}</span>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-xs font-semibold text-wise-gray hover:text-wise-danger transition-colors"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  )
}
