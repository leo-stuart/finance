import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  AreaChart, Area,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { SummaryCards } from '../organisms/SummaryCards'
import { Spinner } from '../atoms/Spinner'
import { useTransactions } from '../../hooks/useTransactions'
import { useCategories } from '../../hooks/useCategories'
import { MONTHS_SHORT_PT, formatBRL } from '../../utils/finance'

const TOOLTIP_STYLE = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: 'rgba(14,15,12,0.12) 0px 0px 0px 1px',
  fontFamily: 'Inter',
  fontSize: '13px',
}

export function AnalyticsPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const { transactions, loading } = useTransactions(year)
  const { categories } = useCategories()

  const monthlyData = useMemo(() => {
    let cumulative = 0
    return MONTHS_SHORT_PT.map((name, m) => {
      const monthTxns = transactions.filter(t => {
        const [y, mo] = t.date.split('-').map(Number)
        return y === year && mo - 1 === m
      })
      const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      const savings = monthTxns.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
      const net = income - expense - savings
      cumulative += net
      const savingsRate = income > 0 ? (savings / income) * 100 : null
      const hasData = income > 0 || expense > 0 || savings > 0
      return { name, income, expense, savings, net, cumulative, savingsRate, hasData }
    })
  }, [transactions, year])

  const incomeByCategory = useMemo(() => {
    const byCategory = new Map<string, number>()
    for (const t of transactions.filter(t => t.type === 'income')) {
      const key = t.category_id ?? '__none__'
      byCategory.set(key, (byCategory.get(key) ?? 0) + t.amount)
    }
    return Array.from(byCategory.entries())
      .map(([key, value]) => {
        const cat = categories.find(c => c.id === key)
        return { name: cat?.name ?? 'Sem categoria', value, color: cat?.color ?? '#9fe870' }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [transactions, categories])

  const expenseByCategory = useMemo(() => {
    const byCategory = new Map<string, number>()
    for (const t of transactions.filter(t => t.type === 'expense')) {
      const key = t.category_id ?? '__none__'
      byCategory.set(key, (byCategory.get(key) ?? 0) + t.amount)
    }
    return Array.from(byCategory.entries())
      .map(([key, value]) => {
        const cat = categories.find(c => c.id === key)
        return { name: cat?.name ?? 'Sem categoria', value, color: cat?.color ?? '#868685' }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [transactions, categories])

  const savingsByCategory = useMemo(() => {
    const byCategory = new Map<string, number>()
    for (const t of transactions.filter(t => t.type === 'savings')) {
      const key = t.category_id ?? '__none__'
      byCategory.set(key, (byCategory.get(key) ?? 0) + t.amount)
    }
    return Array.from(byCategory.entries())
      .map(([key, value]) => {
        const cat = categories.find(c => c.id === key)
        return { name: cat?.name ?? 'Sem categoria', value, color: cat?.color ?? '#0369a1' }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [transactions, categories])

  const momData = useMemo(() =>
    monthlyData.map((m, i) => {
      const prev = i > 0 ? monthlyData[i - 1] : null
      const deltaIncome = prev && prev.income > 0 ? ((m.income - prev.income) / prev.income) * 100 : null
      const deltaExpense = prev && prev.expense > 0 ? ((m.expense - prev.expense) / prev.expense) * 100 : null
      const deltaSavings = prev && prev.savings > 0 ? ((m.savings - prev.savings) / prev.savings) * 100 : null
      return { ...m, deltaIncome, deltaExpense, deltaSavings }
    })
  , [monthlyData])

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 py-4 flex items-center justify-between border-b border-wise-light-surface bg-white sticky top-0 z-10 shadow-[0_1px_0_rgba(14,15,12,0.06)]">
        <h1 className="font-black text-wise-black" style={{ fontSize: '28px', lineHeight: '0.85' }}>
          Analytics
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setYear(y => y - 1)}
            className="w-8 h-8 rounded-full hover:bg-wise-light-surface flex items-center justify-center transition-colors text-wise-warm-dark"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="num font-semibold text-wise-black w-12 text-center">{year}</span>
          <button
            onClick={() => setYear(y => y + 1)}
            className="w-8 h-8 rounded-full hover:bg-wise-light-surface flex items-center justify-center transition-colors text-wise-warm-dark"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1 py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="p-6 flex flex-col gap-6">
          <SummaryCards transactions={transactions} />

          {/* Net balance + savings rate */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card p-6 flex flex-col gap-4 lg:col-span-2">
              <div>
                <h3 className="font-black text-wise-black" style={{ fontSize: '18px', lineHeight: '0.9' }}>
                  Saldo Acumulado
                </h3>
                <p className="text-xs text-wise-gray mt-1">Evolução do patrimônio ao longo do ano</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9fe870" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9fe870" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebe6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#868685', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#868685', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} width={52} />
                  <Tooltip formatter={(v: number) => [formatBRL(v), 'Saldo']} contentStyle={TOOLTIP_STYLE} />
                  <ReferenceLine y={0} stroke="#e8ebe6" />
                  <Area type="monotone" dataKey="cumulative" stroke="#163300" strokeWidth={2} fill="url(#gradCumulative)" dot={false} activeDot={{ r: 4, fill: '#163300' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-6 flex flex-col gap-4">
              <div>
                <h3 className="font-black text-wise-black" style={{ fontSize: '18px', lineHeight: '0.9' }}>
                  Taxa de Poupança
                </h3>
                <p className="text-xs text-wise-gray mt-1">% da renda poupada por mês</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ebe6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#868685', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#868685', fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toFixed(0)}%`} width={36} />
                  <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, 'Poupança']} contentStyle={TOOLTIP_STYLE} />
                  <ReferenceLine y={20} stroke="#9fe870" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="savingsRate" stroke="#0369a1" strokeWidth={2} dot={{ r: 3, fill: '#0369a1' }} activeDot={{ r: 5 }} connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-wise-gray flex items-center gap-1.5">
                <span className="inline-block w-6 border-t-2 border-dashed border-wise-green" />
                Meta 20%
              </p>
            </div>
          </div>

          {/* Income + Expense + Savings by category */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CategoryPie
              title="Entradas por Categoria"
              data={incomeByCategory}
              emptyMsg="Nenhuma entrada registrada"
            />
            <CategoryPie
              title="Saídas por Categoria"
              data={expenseByCategory}
              emptyMsg="Nenhuma saída registrada"
            />
            <CategoryPie
              title="Poupança por Categoria"
              data={savingsByCategory}
              emptyMsg="Nenhuma poupança registrada"
            />
          </div>

          {/* MoM table */}
          <div className="card overflow-hidden">
            <div className="p-6 pb-4">
              <h3 className="font-black text-wise-black" style={{ fontSize: '18px', lineHeight: '0.9' }}>
                Comparativo Mensal
              </h3>
              <p className="text-xs text-wise-gray mt-1">Variação mês a mês</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-wise-light-surface">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-wise-gray">Mês</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-wise-gray">Entradas</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-wise-gray">Var.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-wise-gray">Saídas</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-wise-gray">Var.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-wise-gray">Poupança</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-wise-gray">Var.</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-wise-gray">Saldo mês</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wise-light-surface/50">
                  {momData.filter(m => m.hasData).map(m => (
                    <tr key={m.name} className="hover:bg-wise-bg transition-colors">
                      <td className="px-6 py-3 font-semibold text-wise-black">{m.name}</td>
                      <td className="px-4 py-3 text-right num font-semibold text-wise-positive">
                        {m.income > 0 ? formatBRL(m.income) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DeltaBadge value={m.deltaIncome} />
                      </td>
                      <td className="px-4 py-3 text-right num font-semibold text-wise-danger">
                        {m.expense > 0 ? formatBRL(m.expense) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DeltaBadge value={m.deltaExpense} invert />
                      </td>
                      <td className="px-4 py-3 text-right num font-semibold text-[#0369a1]">
                        {m.savings > 0 ? formatBRL(m.savings) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DeltaBadge value={m.deltaSavings} />
                      </td>
                      <td className={`px-6 py-3 text-right num font-semibold ${m.net >= 0 ? 'text-wise-positive' : 'text-wise-danger'}`}>
                        {formatBRL(m.net)}
                      </td>
                    </tr>
                  ))}
                  {momData.every(m => !m.hasData) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-sm text-wise-gray">
                        Nenhum dado registrado em {year}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryPie({ title, data, emptyMsg }: {
  title: string
  data: { name: string; value: number; color: string }[]
  emptyMsg: string
}) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <h3 className="font-black text-wise-black" style={{ fontSize: '18px', lineHeight: '0.9' }}>{title}</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-wise-gray text-sm">{emptyMsg}</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              formatter={(v: number) => [formatBRL(v), '']}
              contentStyle={TOOLTIP_STYLE}
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
      )}
    </div>
  )
}

function DeltaBadge({ value, invert = false }: { value: number | null; invert?: boolean }) {
  if (value === null) return <span className="text-wise-gray text-xs">—</span>
  const good = invert ? value <= 0 : value >= 0
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold num ${good ? 'text-wise-positive bg-wise-mint' : 'text-wise-danger bg-red-50'}`}>
      {value > 0 ? '+' : ''}{value.toFixed(1)}%
    </span>
  )
}
