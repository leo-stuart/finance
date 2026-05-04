import { useState } from 'react'
import { Plus } from 'lucide-react'
import { GoalCard } from '../molecules/GoalCard'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { FormField } from '../molecules/FormField'
import type { SavingsGoal } from '../../types/finance'

interface SavingsGoalsProps {
  goals: SavingsGoal[]
  onAdd: (g: Pick<SavingsGoal, 'name' | 'target_amount' | 'current_amount' | 'deadline'>) => Promise<{ error: any }>
  onDelete: (id: string) => Promise<{ error: any }>
  onUpdateAmount: (id: string, amount: number) => Promise<{ error: any }>
}

export function SavingsGoals({ goals, onAdd, onDelete, onUpdateAmount }: SavingsGoalsProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [deadline, setDeadline] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetNum = parseFloat(target.replace(',', '.'))
    if (!name.trim() || isNaN(targetNum) || targetNum <= 0) return
    setSaving(true)
    await onAdd({
      name: name.trim(),
      target_amount: targetNum,
      current_amount: parseFloat(current.replace(',', '.')) || 0,
      deadline: deadline || null,
    })
    setName('')
    setTarget('')
    setCurrent('')
    setDeadline('')
    setSaving(false)
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-wise-black" style={{ fontSize: '22px', lineHeight: '0.9' }}>
          Metas de Poupança
        </h3>
        <Button size="sm" onClick={() => setShowForm(v => !v)}>
          <Plus size={14} />
          Nova Meta
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-5 flex flex-col gap-3">
          <p className="text-xs font-bold text-wise-warm-dark uppercase tracking-wider">Nova meta</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nome" htmlFor="goal-name" required>
              <Input id="goal-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Viagem" />
            </FormField>
            <FormField label="Meta (R$)" htmlFor="goal-target" required>
              <Input id="goal-target" value={target} onChange={e => setTarget(e.target.value)} placeholder="0,00" className="num" />
            </FormField>
            <FormField label="Já poupado (R$)" htmlFor="goal-current">
              <Input id="goal-current" value={current} onChange={e => setCurrent(e.target.value)} placeholder="0,00" className="num" />
            </FormField>
            <FormField label="Prazo" htmlFor="goal-deadline">
              <Input id="goal-deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </FormField>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Salvando...' : 'Criar Meta'}
            </Button>
          </div>
        </form>
      )}

      {goals.length === 0 && !showForm && (
        <div className="card p-8 flex flex-col items-center gap-2 text-center">
          <p className="font-semibold text-wise-warm-dark">Nenhuma meta ainda</p>
          <p className="text-sm text-wise-gray">Crie metas para acompanhar seu progresso de poupança.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onDelete={async id => { await onDelete(id) }}
            onUpdateAmount={async (id, amount) => { await onUpdateAmount(id, amount) }}
          />
        ))}
      </div>
    </div>
  )
}
