import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import { MONTHS_SHORT_PT, formatBRL } from '../../utils/finance'
import type { Transaction, InvoiceOverlay } from '../../types/finance'

interface MonthlyChartProps {
  transactions: Transaction[]
  year: number
  invoiceOverlays?: InvoiceOverlay[]
}

export function MonthlyChart({ transactions, year, invoiceOverlays = [] }: MonthlyChartProps) {
  const data = MONTHS_SHORT_PT.map((name, m) => {
    const monthTxns = transactions.filter(t => {
      const [y, mo] = t.date.split('-').map(Number)
      return y === year && mo - 1 === m
    })
    const mStr = String(m + 1).padStart(2, '0')
    const invoiceTotal = invoiceOverlays
      .filter(o => o.date.startsWith(`${year}-${mStr}-`))
      .reduce((s, o) => s + o.amount, 0)
    return {
      name,
      Entradas: monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      Saídas: monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) + invoiceTotal,
      Poupança: monthTxns.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0),
    }
  })

  return (
    <div className="card p-6 flex flex-col gap-4">
      <h3 className="font-black text-wise-black" style={{ fontSize: '18px', lineHeight: '0.9' }}>
        Evolução Mensal
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8ebe6" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#868685', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#868685', fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
            width={52}
          />
          <Tooltip
            formatter={(value: number, name: string) => [formatBRL(value), name]}
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
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
          <Bar dataKey="Entradas" fill="#054d28" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Saídas" fill="#d03238" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Poupança" fill="#0369a1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
