import { formatBRL } from '../../utils/finance'

interface DayCellProps {
  amount: number
  type: 'income' | 'expense' | 'savings'
  onClick: () => void
}

const styles = {
  income: {
    base: 'text-wise-positive',
    highlight: 'bg-wise-mint text-wise-positive',
  },
  expense: {
    base: 'text-wise-danger',
    highlight: 'bg-[rgba(208,50,56,0.12)] text-wise-danger font-semibold',
  },
  savings: {
    base: 'text-[#0369a1]',
    highlight: 'bg-[rgba(3,105,161,0.1)] text-[#0369a1]',
  },
}

export function DayCell({ amount, type, onClick }: DayCellProps) {
  const hasAmount = amount > 0
  const style = styles[type]

  return (
    <td
      onClick={onClick}
      className={`
        px-1.5 py-[3px] text-right cursor-pointer w-[88px] min-w-[88px]
        hover:bg-wise-mint/30 transition-colors duration-100
        num text-xs
        ${hasAmount ? style.highlight : 'text-transparent'}
      `}
      title={`Clique para adicionar ${type === 'income' ? 'entrada' : type === 'expense' ? 'saída' : 'poupança'}`}
    >
      {hasAmount ? formatBRL(amount) : '—'}
    </td>
  )
}
