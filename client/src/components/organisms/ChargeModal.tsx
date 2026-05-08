import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { FormField } from '../molecules/FormField'
import type { CreditCard, CreditCardCharge, Category } from '../../types/finance'

interface ChargeModalProps {
  card: CreditCard
  charge?: CreditCardCharge
  categories: Category[]
  onSave: (data: { purchase_date: string; amount: number; description?: string; category_id?: string | null; installments?: number }) => Promise<{ error: any }>
  onDelete?: (id: string) => Promise<{ error: any }>
  onClose: () => void
}

export function ChargeModal({ card, charge, categories, onSave, onDelete, onClose }: ChargeModalProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [purchaseDate, setPurchaseDate] = useState(charge?.purchase_date ?? today)
  const [amount, setAmount] = useState(charge ? String(charge.amount) : '')
  const [description, setDescription] = useState(charge?.description ?? '')
  const [categoryId, setCategoryId] = useState(charge?.category_id ?? '')
  const [installments, setInstallments] = useState(String(charge?.installments ?? '1'))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const expenseCategories = categories.filter(c => c.type === 'expense')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsed) || parsed <= 0) { setError('Valor inválido'); return }
    const numInstallments = parseInt(installments, 10)
    if (isNaN(numInstallments) || numInstallments < 1 || numInstallments > 48) { setError('Parcelas inválidas (1–48)'); return }
    setSaving(true)
    const { error: err } = await onSave({
      purchase_date: purchaseDate,
      amount: parsed,
      description: description || undefined,
      category_id: categoryId || null,
      installments: numInstallments,
    })
    setSaving(false)
    if (err) setError(err.message)
    else onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-wise-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-card-lg shadow-ring w-full max-w-sm flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wise-light-surface">
          <div>
            <h2 className="font-black text-wise-black" style={{ fontSize: '20px', lineHeight: '0.95' }}>
              {charge ? 'Editar lançamento' : 'Novo lançamento'}
            </h2>
            <p className="text-xs text-wise-gray mt-0.5 font-medium">{card.name}</p>
          </div>
          <button onClick={onClose} className="text-wise-gray hover:text-wise-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <FormField label="Data da compra" htmlFor="ch-date" required>
            <Input
              id="ch-date"
              type="date"
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
            />
          </FormField>

          <FormField label="Valor (R$)" htmlFor="ch-amount" required>
            <Input
              id="ch-amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="num"
            />
          </FormField>

          <FormField label="Parcelas" htmlFor="ch-installments" required>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 6, 10, 12].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setInstallments(String(n))}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    installments === String(n)
                      ? 'bg-wise-black text-white'
                      : 'bg-wise-light-surface text-wise-warm-dark hover:bg-wise-mint'
                  }`}
                >
                  {n === 1 ? 'À vista' : `${n}x`}
                </button>
              ))}
              <Input
                id="ch-installments"
                type="number"
                min={1}
                max={48}
                placeholder="Outro"
                value={[1, 2, 3, 6, 10, 12].includes(parseInt(installments)) ? '' : installments}
                onChange={e => setInstallments(e.target.value)}
                className="w-20 text-sm"
              />
            </div>
          </FormField>

          <FormField label="Descrição" htmlFor="ch-desc">
            <Input
              id="ch-desc"
              type="text"
              placeholder="Opcional"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </FormField>

          {expenseCategories.length > 0 && (
            <FormField label="Categoria" htmlFor="ch-cat">
              <select
                id="ch-cat"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-[10px] border border-[rgba(14,15,12,0.15)] font-medium text-wise-black bg-white focus:outline-none focus:ring-1 focus:ring-wise-gray"
              >
                <option value="">Sem categoria</option>
                {expenseCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>
          )}

          {error && <p className="text-xs text-wise-danger">{error}</p>}

          <div className="flex gap-2 pt-1">
            {charge && onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={async () => {
                  if (!confirm('Remover lançamento?')) return
                  await onDelete(charge.id)
                  onClose()
                }}
              >
                Excluir
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
