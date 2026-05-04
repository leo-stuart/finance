import { useState, useEffect, useCallback } from 'react'
import { DEMO_TRANSACTIONS } from '../lib/demo'
import { apiFetch } from '../lib/api'
import type { Transaction } from '../types/finance'

const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'

export function useTransactions(year: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    if (DEMO) {
      setTransactions(DEMO_TRANSACTIONS.filter(t => t.date.startsWith(String(year))))
      setLoading(false)
      return
    }
    const data = await apiFetch<Transaction[]>(`/transactions?year=${year}`)
    setTransactions(data)
    setLoading(false)
  }, [year])

  useEffect(() => { refresh() }, [refresh])

  const add = async (t: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch('/transactions', { method: 'POST', body: JSON.stringify(t) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const update = async (id: string, t: Partial<Pick<Transaction, 'amount' | 'type' | 'category_id' | 'description' | 'date'>>) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(t) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const remove = async (id: string) => {
    if (DEMO) { alert('Demo: operações de escrita desativadas.'); return { error: null } }
    try {
      await apiFetch(`/transactions/${id}`, { method: 'DELETE' })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  return { transactions, loading, add, update, remove, refresh }
}
