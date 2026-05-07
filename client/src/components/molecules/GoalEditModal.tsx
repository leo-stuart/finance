import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { FormField } from '../molecules/FormField'
import type { SavingsGoal } from '../../types/finance'

interface GoalEditModalProps {
  goal: SavingsGoal
  onSave: (id: string, data: Partial<Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'previous_amount' | 'deadline' | 'next_update_date'>>) => Promise<{ error: any }>
  onClose: () => void
}

export function GoalEditModal({ goal, onSave, onClose }: GoalEditModalProps) {
  const [name, setName] = useState(goal.name)
  const [target, setTarget] = useState(String(goal.target_amount))
  const [current, setCurrent] = useState(String(goal.current_amount))
  const [deadline, setDeadline] = useState(goal.deadline ?? '')
  const [nextUpdate, setNextUpdate] = useState(goal.next_update_date ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetNum = parseFloat(target.replace(',', '.'))
    const currentNum = parseFloat(current.replace(',', '.'))
    if (!name.trim() || isNaN(targetNum) || targetNum <= 0) {
      setError('Nome e meta são obrigatórios.')
      return
    }
    setSaving(true)
    setError('')
    const newCurrentAmount = isNaN(currentNum) ? 0 : currentNum
    const { error: err } = await onSave(goal.id, {
      name: name.trim(),
      target_amount: targetNum,
      previous_amount: goal.current_amount,
      current_amount: newCurrentAmount,
      deadline: deadline || null,
      next_update_date: nextUpdate || null,
    })
    setSaving(false)
    if (err) { setError('Erro ao salvar. Tente novamente.'); return }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-wise-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-card-lg shadow-ring w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wise-light-surface">
          <h2 className="font-black text-wise-black" style={{ fontSize: '20px', lineHeight: '0.95' }}>
            Editar Meta
          </h2>
          <button onClick={onClose} className="text-wise-gray hover:text-wise-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <FormField label="Nome" htmlFor="edit-goal-name" required>
                <Input
                  id="edit-goal-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Viagem"
                />
              </FormField>
            </div>
            <FormField label="Meta (R$)" htmlFor="edit-goal-target" required>
              <Input
                id="edit-goal-target"
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder="0,00"
                className="num"
              />
            </FormField>
            <FormField label="Já poupado (R$)" htmlFor="edit-goal-current">
              <Input
                id="edit-goal-current"
                value={current}
                onChange={e => setCurrent(e.target.value)}
                placeholder="0,00"
                className="num"
              />
            </FormField>
            <FormField label="Prazo" htmlFor="edit-goal-deadline">
              <Input
                id="edit-goal-deadline"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </FormField>
            <FormField label="Atualizar em" htmlFor="edit-goal-next-update">
              <Input
                id="edit-goal-next-update"
                type="date"
                value={nextUpdate}
                onChange={e => setNextUpdate(e.target.value)}
              />
            </FormField>
          </div>

          {error && <p className="text-xs text-wise-danger">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
