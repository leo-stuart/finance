import { useState } from 'react'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-wise-bg">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-wise-bg">
      <Sidebar
        user={user}
        onSignOut={signOut}
        onOpenCategories={() => setShowCategories(true)}
      />
      <main className="flex-1 overflow-auto">
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
