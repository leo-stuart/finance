import type { Transaction, DayData, InvoiceOverlay } from '../types/finance'

export const MONTHS_PT = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
]

export const MONTHS_SHORT_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export const formatBRL = (amount: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate()

export const toDateString = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export const parseTransactionDate = (dateStr: string): { year: number; month: number; day: number } => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return { year, month: month - 1, day }
}

export const computeMonthDays = (
  year: number,
  month: number,
  transactions: Transaction[],
  invoiceOverlays: InvoiceOverlay[] = [],
): DayData[] => {
  const daysInMonth = getDaysInMonth(year, month)
  const byDay = new Map<number, Transaction[]>()

  for (const t of transactions) {
    const { day } = parseTransactionDate(t.date)
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day)!.push(t)
  }

  // Build invoice totals by day number for this month
  const invoiceByDay = new Map<number, number>()
  const m = String(month + 1).padStart(2, '0')
  for (const overlay of invoiceOverlays) {
    if (!overlay.date.startsWith(`${year}-${m}-`)) continue
    const day = parseInt(overlay.date.slice(8), 10)
    invoiceByDay.set(day, (invoiceByDay.get(day) ?? 0) + overlay.amount)
  }

  let cumulativeNet = 0
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dayTxns = byDay.get(day) ?? []
    const income = dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const savings = dayTxns.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
    const creditCardInvoice = invoiceByDay.get(day) ?? 0
    cumulativeNet += income - expense - savings - creditCardInvoice
    return { day, income, expense, savings, creditCardInvoice, cumulativeNet, transactions: dayTxns }
  })
}

export const computeStartingBalances = (
  year: number,
  allTransactions: Transaction[],
  invoiceOverlays: InvoiceOverlay[] = [],
): number[] => {
  const balances = new Array(12).fill(0)
  let running = 0
  for (let m = 0; m < 12; m++) {
    balances[m] = running
    const monthTxns = allTransactions.filter(t => {
      const { month } = parseTransactionDate(t.date)
      return month === m
    })
    const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const savings = monthTxns.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
    const mStr = String(m + 1).padStart(2, '0')
    const creditCard = invoiceOverlays
      .filter(o => o.date.startsWith(`${year}-${mStr}-`))
      .reduce((s, o) => s + o.amount, 0)
    running += income - expense - savings - creditCard
  }
  return balances
}
