import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { FormField } from '../molecules/FormField'
import type { CreditCard } from '../../types/finance'

const PRESET_COLORS = [
  '#9fe870', '#ffc091', '#cdffad', '#38c8ff',
  '#ffd11a', '#d03238', '#0369a1', '#454745',
]

interface CreditCardModalProps {
  card?: CreditCard
  onSave: (data: Pick<CreditCard, 'name' | 'closing_day' | 'due_day' | 'limit_amount' | 'color'>) => Promise<{ error: any }>
  onClose: () => void
}

export function CreditCardModal({ card, onSave, onClose }: CreditCardModalProps) {
  const [name, setName] = useState(card?.name ?? '')
  const [closingDay, setClosingDay] = useState(String(card?.closing_day ?? ''))
  const [dueDay, setDueDay] = useState(String(card?.due_day ?? ''))
  const [limitAmount, setLimitAmount] = useState(card?.limit_amount ? String(card.limit_amount) : '')
  const [color, setColor] = useState(card?.color ?? '#9fe870')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const closing = parseInt(closingDay, 10)
    const due = parseInt(dueDay, 10)
    if (!name.trim()) { setError('Nome obrigatório'); return }
    if (isNaN(closing) || closing < 1 || closing > 31) { setError('Dia de fechamento inválido (1–31)'); return }
    if (isNaN(due) || due < 1 || due > 31) { setError('Dia de vencimento inválido (1–31)'); return }
    const limit = limitAmount ? parseFloat(limitAmount.replace(',', '.')) : null
    if (limitAmount && (isNaN(limit!) || limit! <= 0)) { setError('Limite inválido'); return }
    setSaving(true)
    const { error: err } = await onSave({ name: name.trim(), closing_day: closing, due_day: due, limit_amount: limit, color })
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
          <h2 className="font-black text-wise-black" style={{ fontSize: '20px', lineHeight: '0.95' }}>
            {card ? 'Editar cartão' : 'Novo cartão'}
          </h2>
          <button onClick={onClose} className="text-wise-gray hover:text-wise-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <FormField label="Nome do cartão" htmlFor="cc-name" required>
            <Input
              id="cc-name"
              type="text"
              placeholder="Ex: Nubank, Itaú Visa"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Fecha dia" htmlFor="cc-closing" required>
              <Input
                id="cc-closing"
                type="number"
                min={1}
                max={31}
                placeholder="5"
                value={closingDay}
                onChange={e => setClosingDay(e.target.value)}
              />
            </FormField>
            <FormField label="Vence dia" htmlFor="cc-due" required>
              <Input
                id="cc-due"
                type="number"
                min={1}
                max={31}
                placeholder="20"
                value={dueDay}
                onChange={e => setDueDay(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Limite (R$, opcional)" htmlFor="cc-limit">
            <Input
              id="cc-limit"
              type="text"
              inputMode="decimal"
              placeholder="5000,00"
              value={limitAmount}
              onChange={e => setLimitAmount(e.target.value)}
              className="num"
            />
          </FormField>

          <div>
            <p className="text-xs font-bold text-wise-warm-dark uppercase tracking-wider mb-2">Cor</p>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 shadow-ring' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-wise-danger">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
