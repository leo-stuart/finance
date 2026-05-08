import type { CreditCard, CreditCardCharge, InvoiceOverlay } from '../types/finance'

function lastDayOf(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate()
}

function clampedDate(y: number, m: number, day: number): Date {
  return new Date(y, m, Math.min(day, lastDayOf(y, m)))
}

function getClosingDate(purchaseDate: Date, closingDay: number): Date {
  const d = purchaseDate.getDate()
  const m = purchaseDate.getMonth()
  const y = purchaseDate.getFullYear()
  const closingThisMonth = clampedDate(y, m, closingDay)
  if (d <= closingThisMonth.getDate()) {
    return closingThisMonth
  }
  return clampedDate(y, m + 1, closingDay)
}

function getDueDate(closingDate: Date, dueDay: number): Date {
  const closingDay = closingDate.getDate()
  const m = closingDate.getMonth()
  const y = closingDate.getFullYear()
  if (dueDay >= closingDay) {
    return clampedDate(y, m, dueDay)
  }
  return clampedDate(y, m + 1, dueDay)
}

export function getInstallmentDueDate(purchaseDate: Date, card: CreditCard, installmentIndex: number): Date {
  const closingDate = getClosingDate(purchaseDate, card.closing_day)
  const firstDueDate = getDueDate(closingDate, card.due_day)
  return new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + installmentIndex, firstDueDate.getDate())
}

export function computeYearInvoices(
  charges: CreditCardCharge[],
  cards: CreditCard[],
  year: number,
): InvoiceOverlay[] {
  const map = new Map<string, InvoiceOverlay>()

  for (const charge of charges) {
    const card = cards.find(c => c.id === charge.credit_card_id)
    if (!card) continue

    const purchaseDate = new Date(charge.purchase_date + 'T00:00:00')
    const installmentAmount = charge.amount / charge.installments

    for (let i = 0; i < charge.installments; i++) {
      const dueDate = getInstallmentDueDate(purchaseDate, card, i)
      if (dueDate.getFullYear() !== year) continue

      const dateStr = toDateStr(dueDate)
      const key = `${charge.credit_card_id}:${dateStr}`

      if (!map.has(key)) {
        map.set(key, { date: dateStr, cardId: card.id, cardName: card.name, color: card.color, amount: 0 })
      }
      map.get(key)!.amount += installmentAmount
    }
  }

  return Array.from(map.values())
}

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getCardCurrentInvoiceTotal(charges: CreditCardCharge[], card: CreditCard): number {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Current due date (upcoming or today)
  const y = today.getFullYear()
  const m = today.getMonth()
  const closingThisMonth = clampedDate(y, m, card.closing_day)
  let nextClosing: Date
  if (today <= closingThisMonth) {
    nextClosing = closingThisMonth
  } else {
    nextClosing = clampedDate(y, m + 1, card.closing_day)
  }
  const nextDue = getDueDate(nextClosing, card.due_day)
  const nextDueStr = toDateStr(nextDue)

  let total = 0
  for (const charge of charges) {
    const purchaseDate = new Date(charge.purchase_date + 'T00:00:00')
    const installmentAmount = charge.amount / charge.installments
    for (let i = 0; i < charge.installments; i++) {
      const dueDate = getInstallmentDueDate(purchaseDate, card, i)
      if (toDateStr(dueDate) === nextDueStr) {
        total += installmentAmount
      }
    }
  }
  return total
}

export function getCardNextDueDate(card: CreditCard): Date {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const y = today.getFullYear()
  const m = today.getMonth()
  const closingThisMonth = clampedDate(y, m, card.closing_day)
  const nextClosing = today <= closingThisMonth
    ? closingThisMonth
    : clampedDate(y, m + 1, card.closing_day)
  return getDueDate(nextClosing, card.due_day)
}
