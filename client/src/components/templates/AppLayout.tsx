import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '../organisms/Sidebar'
import { CategoryManager } from '../organisms/CategoryManager'
import { useAuth } from '../../hooks/useAuth'
import { useCategories } from '../../hooks/useCategories'
import { Spinner } from '../atoms/Spinner'
import { Navigate } from 'react-router-dom'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, loading, signOut } = useAuth()
  const { categories, add: addCategory, remove: removeCategory } = useCategories()
  const [showCategories, setShowCategories] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-wise-bg">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-wise-bg">
      {/* Mobile top bar */}
      <div className="md:hidden shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-wise-light-surface">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-wise-light-surface transition-colors"
        >
          <Menu size={18} />
        </button>
        <span className="font-black text-wise-black" style={{ fontSize: '18px', fontFeatureSettings: '"calt"' }}>
          Finanças
        </span>
        <div className="w-8" />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, flow on desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          md:relative md:inset-auto md:z-auto md:translate-x-0
          transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar
          user={user}
          onSignOut={signOut}
          onOpenCategories={() => setShowCategories(true)}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 overflow-auto min-h-0">
        {children}
      </main>

      {showCategories && (
        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onDelete={removeCategory}
          onClose={() => setShowCategories(false)}
        />
      )}
    </div>
  )
}
