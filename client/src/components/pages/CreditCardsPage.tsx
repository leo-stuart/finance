import { useState } from 'react'
import { Plus, CreditCard as CardIcon, Pencil, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '../atoms/Button'
import { Spinner } from '../atoms/Spinner'
import { CreditCardModal } from '../organisms/CreditCardModal'
import { ChargeModal } from '../organisms/ChargeModal'
import { useCreditCards } from '../../hooks/useCreditCards'
import { useCreditCardCharges } from '../../hooks/useCreditCardCharges'
import { useCategories } from '../../hooks/useCategories'
import { formatBRL } from '../../utils/finance'
import { getCardCurrentInvoiceTotal, getCardNextDueDate, getInstallmentDueDate } from '../../utils/creditCards'
import type { CreditCard, CreditCardCharge } from '../../types/finance'

export function CreditCardsPage() {
  const { cards, loading, add, update, remove } = useCreditCards()
  const { categories } = useCategories()
  const [showCardModal, setShowCardModal] = useState(false)
  const [editCard, setEditCard] = useState<CreditCard | undefined>()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [editCharge, setEditCharge] = useState<CreditCardCharge | undefined>()

  const selectedCard = cards.find(c => c.id === selectedCardId) ?? null

  const { charges, loading: chargesLoading, add: addCharge, update: updateCharge, remove: removeCharge } = useCreditCardCharges(selectedCardId)

  const handleDeleteCard = async (card: CreditCard) => {
    if (!confirm(`Excluir cartão "${card.name}"? Todos os lançamentos serão removidos.`)) return
    await remove(card.id)
    if (selectedCardId === card.id) setSelectedCardId(null)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Card list panel */}
      <div className="w-72 shrink-0 border-r border-wise-light-surface flex flex-col">
        <div className="px-6 py-4 border-b border-wise-light-surface flex items-center justify-between bg-white sticky top-0 z-10 shadow-[0_1px_0_rgba(14,15,12,0.06)]">
          <h1 className="font-black text-wise-black" style={{ fontSize: '26px', lineHeight: '0.85' }}>Cartões</h1>
          <Button size="sm" onClick={() => { setEditCard(undefined); setShowCardModal(true) }}>
            <Plus size={14} />
            Novo
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-2 px-3">
          {cards.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
              <CardIcon size={32} className="text-wise-light-surface" />
              <p className="text-sm text-wise-gray">Nenhum cartão cadastrado</p>
              <Button size="sm" onClick={() => { setEditCard(undefined); setShowCardModal(true) }}>
                <Plus size={14} /> Adicionar cartão
              </Button>
            </div>
          )}
          {cards.map(card => (
            <CardTile
              key={card.id}
              card={card}
              charges={[]}
              selected={selectedCardId === card.id}
              onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
              onEdit={() => { setEditCard(card); setShowCardModal(true) }}
              onDelete={() => handleDeleteCard(card)}
            />
          ))}
        </div>
      </div>

      {/* Card detail panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedCard ? (
          <div className="flex-1 flex items-center justify-center text-wise-gray text-sm">
            Selecione um cartão para ver os lançamentos
          </div>
        ) : (
          <CardDetail
            card={selectedCard}
            charges={charges}
            loading={chargesLoading}
            categories={categories}
            onAddCharge={() => { setEditCharge(undefined); setShowChargeModal(true) }}
            onEditCharge={(c) => { setEditCharge(c); setShowChargeModal(true) }}
            onDeleteCharge={removeCharge}
          />
        )}
      </div>

      {showCardModal && (
        <CreditCardModal
          card={editCard}
          onSave={editCard
            ? (data) => update(editCard.id, data)
            : (data) => add(data)
          }
          onClose={() => setShowCardModal(false)}
        />
      )}

      {showChargeModal && selectedCard && (
        <ChargeModal
          card={selectedCard}
          charge={editCharge}
          categories={categories}
          onSave={editCharge
            ? (data) => updateCharge(editCharge.id, data)
            : (data) => addCharge(data)
          }
          onDelete={editCharge ? removeCharge : undefined}
          onClose={() => setShowChargeModal(false)}
        />
      )}
    </div>
  )
}

function CardTile({ card, selected, onClick, onEdit, onDelete }: {
  card: CreditCard
  charges: CreditCardCharge[]
  selected: boolean
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`group rounded-[16px] p-3 cursor-pointer transition-all ${selected ? 'bg-wise-black text-white shadow-ring' : 'hover:bg-wise-bg bg-white border border-wise-light-surface'}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: card.color }} />
        <span className="font-semibold text-sm truncate flex-1">{card.name}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); onEdit() }}
            className={`p-1 rounded-full transition-colors ${selected ? 'hover:bg-white/20' : 'hover:bg-wise-light-surface'}`}
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className={`p-1 rounded-full transition-colors ${selected ? 'hover:bg-white/20 text-red-300' : 'hover:bg-wise-light-surface text-wise-danger'}`}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
      <div className={`text-xs ${selected ? 'text-white/60' : 'text-wise-gray'}`}>
        Fecha {card.closing_day} · Vence {card.due_day}
      </div>
    </div>
  )
}

function CardDetail({ card, charges, loading, categories, onAddCharge, onEditCharge, onDeleteCharge }: {
  card: CreditCard
  charges: CreditCardCharge[]
  loading: boolean
  categories: ReturnType<typeof useCategories>['categories']
  onAddCharge: () => void
  onEditCharge: (c: CreditCardCharge) => void
  onDeleteCharge: (id: string) => Promise<{ error: any }>
}) {
  const [tab, setTab] = useState<'current' | 'all'>('current')
  const nextDue = getCardNextDueDate(card)
  const invoiceTotal = getCardCurrentInvoiceTotal(charges, card)

  // Split charges by installment into visible rows
  const allRows = charges.flatMap(charge => {
    const purchaseDate = new Date(charge.purchase_date + 'T00:00:00')
    if (charge.installments === 1) {
      return [{ charge, installmentIndex: 0, dueDate: getInstallmentDueDate(purchaseDate, card, 0) }]
    }
    return Array.from({ length: charge.installments }, (_, i) => ({
      charge,
      installmentIndex: i,
      dueDate: getInstallmentDueDate(purchaseDate, card, i),
    }))
  })

  const nextDueStr = nextDue.toISOString().slice(0, 10)
  const currentRows = allRows.filter(r => r.dueDate.toISOString().slice(0, 10) === nextDueStr)
  const displayRows = tab === 'current' ? currentRows : allRows

  // Sort by due date desc then purchase date
  displayRows.sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())

  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-wise-light-surface bg-white sticky top-0 z-10 shadow-[0_1px_0_rgba(14,15,12,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: card.color }} />
              <h2 className="font-black text-wise-black" style={{ fontSize: '24px', lineHeight: '0.85' }}>{card.name}</h2>
            </div>
            <p className="text-xs text-wise-gray mt-1">Fecha dia {card.closing_day} · Vence dia {card.due_day}</p>
          </div>
          <Button size="sm" onClick={onAddCharge}>
            <Plus size={14} />
            Lançamento
          </Button>
        </div>

        {/* Invoice summary */}
        <div className="flex gap-4 p-3 bg-wise-bg rounded-[16px]">
          <div>
            <p className="text-xs text-wise-gray">Próxima fatura</p>
            <p className="num font-semibold text-wise-danger text-lg">{formatBRL(invoiceTotal)}</p>
          </div>
          <div>
            <p className="text-xs text-wise-gray">Vencimento</p>
            <p className="num font-semibold text-wise-black text-sm">{formatDate(nextDue)}</p>
          </div>
          {card.limit_amount && (
            <>
              <div>
                <p className="text-xs text-wise-gray">Limite</p>
                <p className="num font-semibold text-wise-black text-sm">{formatBRL(card.limit_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-wise-gray">Disponível</p>
                <p className="num font-semibold text-wise-black text-sm">{formatBRL(card.limit_amount - invoiceTotal)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 py-3 border-b border-wise-light-surface">
        {([['current', 'Fatura atual'], ['all', 'Todos']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${tab === key ? 'bg-wise-black text-white' : 'bg-wise-light-surface text-wise-warm-dark hover:bg-wise-mint'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Charges list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32"><Spinner /></div>
        ) : displayRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <p className="text-sm text-wise-gray">Nenhum lançamento</p>
            <Button size="sm" variant="secondary" onClick={onAddCharge}><Plus size={14} />Adicionar</Button>
          </div>
        ) : (
          <div className="divide-y divide-wise-light-surface/50">
            {displayRows.map(({ charge, installmentIndex, dueDate }) => {
              const cat = categories.find(c => c.id === charge.category_id)
              const installmentAmount = charge.amount / charge.installments
              return (
                <div
                  key={`${charge.id}-${installmentIndex}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-wise-bg transition-colors cursor-pointer group"
                  onClick={() => onEditCharge(charge)}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-semibold text-sm text-wise-black truncate">
                      {charge.description || 'Lançamento'}
                      {charge.installments > 1 && (
                        <span className="ml-1.5 text-xs text-wise-gray font-normal">
                          ({installmentIndex + 1}/{charge.installments})
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-wise-gray">
                      <span>{new Date(charge.purchase_date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                      {cat && <span>· {cat.name}</span>}
                      <span>· vence {formatDate(dueDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="num font-semibold text-wise-danger text-sm">
                      {formatBRL(installmentAmount)}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); onDeleteCharge(charge.id) }}
                      className="text-wise-gray hover:text-wise-danger opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
