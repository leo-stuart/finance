import { useState } from 'react'
import { X, Trash2, Pencil } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { FormField } from '../molecules/FormField'
import { formatBRL } from '../../utils/finance'
import type { Transaction, Category, TransactionType } from '../../types/finance'

interface TransactionModalProps {
  date: string
  defaultType: TransactionType
  dayTransactions: Transaction[]
  categories: Category[]
  onAdd: (t: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<{ error: any }>
  onUpdate: (id: string, t: Partial<Pick<Transaction, 'amount' | 'type' | 'category_id' | 'description'>>) => Promise<{ error: any }>
  onDelete: (id: string) => Promise<{ error: any }>
  onClose: () => void
}

const typeLabels: Record<TransactionType, string> = {
  income: 'Entrada',
  expense: 'Saída',
  savings: 'Poupança',
}

const typeColors: Record<TransactionType, string> = {
  income: 'text-wise-positive',
  expense: 'text-wise-danger',
  savings: 'text-[#0369a1]',
}

export function TransactionModal({
  date,
  defaultType,
  dayTransactions,
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(defaultType)
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const startEditing = (t: Transaction) => {
    setEditingId(t.id)
    setType(t.type)
    setAmount(t.amount.toFixed(2).replace('.', ','))
    setCategoryId(t.category_id ?? '')
    setDescription(t.description ?? '')
    setError('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setType(defaultType)
    setAmount('')
    setCategoryId('')
    setDescription('')
    setError('')
  }

  const filteredCategories = categories.filter(c => c.type === type)

  const [day, month, year] = (() => {
    const [y, m, d] = date.split('-')
    return [d, m, y]
  })()
  const displayDate = `${day}/${month}/${year}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsed) || parsed <= 0) {
      setError('Valor inválido')
      return
    }
    setSaving(true)
    if (editingId) {
      const { error: err } = await onUpdate(editingId, {
        amount: parsed,
        type,
        category_id: categoryId || null,
        description,
      })
      setSaving(false)
      if (err) setError(err.message)
      else cancelEditing()
    } else {
      const { error: err } = await onAdd({
        date,
        amount: parsed,
        type,
        category_id: categoryId || null,
        description,
      })
      setSaving(false)
      if (err) setError(err.message)
      else {
        setAmount('')
        setCategoryId('')
        setDescription('')
        setError('')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta transação?')) return
    await onDelete(id)
  }

  return (
    <div
      className="fixed inset-0 bg-wise-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-card-lg shadow-ring w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wise-light-surface">
          <div>
            <h2 className="font-black text-wise-black" style={{ fontSize: '20px', lineHeight: '0.95' }}>
              Transações
            </h2>
            <p className="text-sm text-wise-gray mt-0.5">{displayDate}</p>
          </div>
          <button onClick={onClose} className="text-wise-gray hover:text-wise-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {dayTransactions.length > 0 && (
            <div className="px-6 py-4 border-b border-wise-light-surface">
              <p className="text-xs font-bold text-wise-warm-dark uppercase tracking-wider mb-3">Registradas</p>
              <div className="flex flex-col gap-2">
                {dayTransactions.map(t => {
                  const cat = categories.find(c => c.id === t.category_id)
                  return (
                    <div key={t.id} className={`flex items-center justify-between gap-3 p-3 rounded-[16px] transition-colors ${editingId === t.id ? 'bg-wise-mint' : 'bg-wise-bg'}`}>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={`num font-semibold text-sm ${typeColors[t.type]}`}>
                          {formatBRL(t.amount)}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-wise-gray">
                          <span className={`font-medium ${typeColors[t.type]}`}>{typeLabels[t.type]}</span>
                          {cat && <span>· {cat.name}</span>}
                          {t.description && <span>· {t.description}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEditing(t)}
                          className="text-wise-gray hover:text-wise-black transition-colors p-1"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-wise-gray hover:text-wise-danger transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-4">
            <p className="text-xs font-bold text-wise-warm-dark uppercase tracking-wider">
              {editingId ? 'Editar transação' : 'Nova transação'}
            </p>

            <div className="flex gap-2">
              {(['income', 'expense', 'savings'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                    type === t
                      ? t === 'income' ? 'bg-wise-mint text-wise-positive shadow-ring'
                        : t === 'expense' ? 'bg-[rgba(208,50,56,0.12)] text-wise-danger shadow-ring'
                        : 'bg-[rgba(3,105,161,0.1)] text-[#0369a1] shadow-ring'
                      : 'bg-wise-light-surface text-wise-gray hover:bg-wise-bg'
                  }`}
                >
                  {typeLabels[t]}
                </button>
              ))}
            </div>

            <FormField label="Valor (R$)" htmlFor="amount" required>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                error={error}
                className="num"
              />
            </FormField>

            {filteredCategories.length > 0 && (
              <FormField label="Categoria" htmlFor="category">
                <select
                  id="category"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] border border-[rgba(14,15,12,0.15)] font-medium text-wise-black bg-white focus:outline-none focus:ring-1 focus:ring-wise-gray"
                >
                  <option value="">Sem categoria</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
            )}

            <FormField label="Descrição" htmlFor="description">
              <Input
                id="description"
                type="text"
                placeholder="Opcional"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </FormField>

            {error && <p className="text-xs text-wise-danger">{error}</p>}

            <div className="flex gap-2 pt-1">
              {editingId ? (
                <Button type="button" variant="ghost" onClick={cancelEditing} className="flex-1">
                  Cancelar edição
                </Button>
              ) : (
                <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
