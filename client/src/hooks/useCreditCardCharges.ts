import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../lib/api'
import type { CreditCardCharge } from '../types/finance'

export function useCreditCardCharges(cardId: string | null) {
  const [charges, setCharges] = useState<CreditCardCharge[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!cardId) { setCharges([]); return }
    setLoading(true)
    const data = await apiFetch<CreditCardCharge[]>(`/credit-cards/${cardId}/charges`)
    setCharges(data)
    setLoading(false)
  }, [cardId])

  useEffect(() => { refresh() }, [refresh])

  const add = async (charge: { purchase_date: string; amount: number; description?: string; category_id?: string | null; installments?: number }) => {
    if (!cardId) return { error: new Error('No card selected') }
    try {
      await apiFetch(`/credit-cards/${cardId}/charges`, { method: 'POST', body: JSON.stringify(charge) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const update = async (id: string, charge: Partial<Pick<CreditCardCharge, 'purchase_date' | 'amount' | 'description' | 'category_id' | 'installments'>>) => {
    try {
      await apiFetch(`/credit-card-charges/${id}`, { method: 'PATCH', body: JSON.stringify(charge) })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  const remove = async (id: string) => {
    try {
      await apiFetch(`/credit-card-charges/${id}`, { method: 'DELETE' })
      await refresh()
      return { error: null }
    } catch (e) {
      return { error: e instanceof Error ? e : new Error('Unknown error') }
    }
  }

  return { charges, loading, add, update, remove, refresh }
}

export function useAllCreditCardCharges() {
  const [charges, setCharges] = useState<CreditCardCharge[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await apiFetch<CreditCardCharge[]>('/credit-card-charges')
    setCharges(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { charges, loading, refresh }
}
