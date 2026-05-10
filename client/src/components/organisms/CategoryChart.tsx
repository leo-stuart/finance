import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatBRL } from '../../utils/finance'
import { getInstallmentDueDate } from '../../utils/creditCards'
import type { Transaction, Category, CreditCardCharge, CreditCard } from '../../types/finance'

interface CategoryChartProps {
  transactions: Transaction[]
  categories: Category[]
  charges?: CreditCardCharge[]
  cards?: CreditCard[]
  year?: number
}

export function CategoryChart({ transactions, categories, charges = [], cards = [], year }: CategoryChartProps) {
  const expenses = transactions.filter(t => t.type === 'expense')

  const byCategory = new Map<string, number>()
  for (const t of expenses) {
    const key = t.category_id ?? '__none__'
    byCategory.set(key, (byCategory.get(key) ?? 0) + t.amount)
  }

  for (const charge of charges) {
    const card = cards.find(c => c.id === charge.credit_card_id)
    if (!card) continue
    const purchaseDate = new Date(charge.purchase_date + 'T00:00:00')
    const installmentAmount = charge.amount / charge.installments
    for (let i = 0; i < charge.installments; i++) {
      const dueDate = getInstallmentDueDate(purchaseDate, card, i)
      if (year !== undefined && dueDate.getFullYear() !== year) continue
      const key = charge.category_id ?? '__none__'
      byCategory.set(key, (byCategory.get(key) ?? 0) + installmentAmount)
    }
  }

  const data = Array.from(byCategory.entries())
    .map(([key, value]) => {
      const cat = categories.find(c => c.id === key)
      return {
        name: cat?.name ?? 'Sem categoria',
        value,
        color: cat?.color ?? '#868685',
      }
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  if (data.length === 0) {
    return (
      <div className="card p-6 flex flex-col gap-4">
        <h3 className="font-black text-wise-black" style={{ fontSize: '18px', lineHeight: '0.9' }}>
          Saídas por Categoria
        </h3>
        <div className="flex items-center justify-center h-48 text-wise-gray text-sm">
          Nenhuma saída registrada
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 flex flex-col gap-4">
      <h3 className="font-black text-wise-black" style={{ fontSize: '18px', lineHeight: '0.9' }}>
        Saídas por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatBRL(value), '']}
            contentStyle={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: 'rgba(14,15,12,0.12) 0px 0px 0px 1px',
              fontFamily: 'Inter',
              fontSize: '13px',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value, entry: any) => (
              <span style={{ color: '#454745' }}>
                {value} — <span style={{ fontFamily: 'IBM Plex Mono', color: '#0e0f0c' }}>
                  {formatBRL(entry.payload.value)}
                </span>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
