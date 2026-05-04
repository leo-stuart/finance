import { useState, useEffect, useCallback } from 'react'
import { DEMO_GOALS } from '../lib/demo'
import { apiFetch } from '../lib/api'
import type { SavingsGoal } from '../types/finance'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export function useSavings() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (DEMO) {
      setGoals(DEMO_GOALS)
      setLoading(false)
      return
    }
    const data = await apiFetch<SavingsGoal[]>('/savings')
    setGoals(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const add = async (g: Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'deadline'>) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch('/savings', { method: 'POST', body: JSON.stringify(g) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const update = async (id: string, g: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'deadline'>>) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch(`/savings/${id}`, { method: 'PATCH', body: JSON.stringify(g) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const remove = async (id: string) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch(`/savings/${id}`, { method: 'DELETE' })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  return { goals, loading, add, update, remove }
}
