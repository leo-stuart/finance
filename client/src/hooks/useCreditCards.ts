import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import type { CreditCard } from '../types/finance'

export function useCreditCards() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await apiFetch<CreditCard[]>('/credit-cards')
    setCards(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const add = async (c: Pick<CreditCard, 'name' | 'closing_day' | 'due_day' | 'limit_amount' | 'color'>) => {
    try {
      await apiFetch('/credit-cards', { method: 'POST', body: JSON.stringify(c) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const update = async (id: string, c: Partial<Pick<CreditCard, 'name' | 'closing_day' | 'due_day' | 'limit_amount' | 'color'>>) => {
    try {
      await apiFetch(`/credit-cards/${id}`, { method: 'PATCH', body: JSON.stringify(c) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const remove = async (id: string) => {
    try {
      await apiFetch(`/credit-cards/${id}`, { method: 'DELETE' })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  return { cards, loading, add, update, remove, refresh }
}
