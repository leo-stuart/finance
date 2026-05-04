import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { Badge } from '../atoms/Badge'
import { FormField } from '../molecules/FormField'
import type { Category, TransactionType } from '../../types/finance'

interface CategoryManagerProps {
  categories: Category[]
  onAdd: (c: Pick<Category, 'name' | 'type' | 'color'>) => Promise<{ error: any }>
  onDelete: (id: string) => Promise<{ error: any }>
  onClose: () => void
}

const PRESET_COLORS = [
  '#9fe870', '#163300', '#054d28', '#0369a1', '#7c3aed',
  '#db2777', '#ea580c', '#ca8a04', '#374151', '#6b7280',
]

const typeLabels: Record<TransactionType, string> = {
  income: 'Entrada',
  expense: 'Saída',
  savings: 'Poupança',
}

export function CategoryManager({ categories, onAdd, onDelete, onClose }: CategoryManagerProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [color, setColor] = useState('#9fe870')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await onAdd({ name: name.trim(), type, color })
    setName('')
    setSaving(false)
  }

  return (
    <div
      className="fixed inset-0 bg-wise-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-card-lg shadow-ring w-full max-w-md flex flex-col overflow-hidden max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wise-light-surface">
          <h2 className="font-black text-wise-black" style={{ fontSize: '20px', lineHeight: '0.95' }}>
            Categorias
          </h2>
          <button onClick={onClose} className="text-wise-gray hover:text-wise-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {categories.length === 0 && (
              <p className="text-sm text-wise-gray text-center py-4">Nenhuma categoria ainda.</p>
            )}
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-[16px] bg-wise-bg">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge color={c.color}>{typeLabels[c.type]}</Badge>
                  <span className="text-sm font-medium text-wise-black truncate">{c.name}</span>
                </div>
                <button
                  onClick={() => onDelete(c.id)}
                  className="text-wise-gray hover:text-wise-danger transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAdd} className="flex flex-col gap-3 border-t border-wise-light-surface pt-4">
            <p className="text-xs font-bold text-wise-warm-dark uppercase tracking-wider">Nova categoria</p>

            <FormField label="Nome" htmlFor="cat-name" required>
              <Input
                id="cat-name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Alimentação"
              />
            </FormField>

            <div className="flex gap-2">
              {(['income', 'expense', 'savings'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                    type === t ? 'bg-wise-black text-white' : 'bg-wise-light-surface text-wise-gray hover:bg-wise-bg'
                  }`}
                >
                  {typeLabels[t]}
                </button>
              ))}
            </div>

            <FormField label="Cor">
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                      color === c ? 'ring-2 ring-offset-2 ring-wise-black scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </FormField>

            <Button type="submit" disabled={saving || !name.trim()} className="mt-1">
              <Plus size={16} />
              {saving ? 'Salvando...' : 'Adicionar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
