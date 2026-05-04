import { useState, useEffect, useCallback } from 'react'
import { DEMO_CATEGORIES } from '../lib/demo'
import { apiFetch } from '../lib/api'
import type { Category } from '../types/finance'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (DEMO) {
      setCategories(DEMO_CATEGORIES)
      setLoading(false)
      return
    }
    const data = await apiFetch<Category[]>('/categories')
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const add = async (c: Pick<Category, 'name' | 'type' | 'color'>) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch('/categories', { method: 'POST', body: JSON.stringify(c) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const update = async (id: string, c: Partial<Pick<Category, 'name' | 'type' | 'color'>>) => {
    if (DEMO) return { error: null }
    try {
      await apiFetch(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(c) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const remove = async (id: string) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  return { categories, loading, add, update, remove }
}
