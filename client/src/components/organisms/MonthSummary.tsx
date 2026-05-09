import { formatBRL } from '../../utils/finance'
import { COL_WIDTHS } from './MonthColumn'

interface MonthSummaryProps {
  totalIncome: number
  totalExpense: number
  totalSavings: number
  startingBalance: number
  endingBalance: number
}

export function MonthSummary({ totalIncome, totalExpense, totalSavings, endingBalance }: MonthSummaryProps) {
  const net = totalIncome - totalExpense - totalSavings

  return (
    <div
      className="grid border-t-2 border-wise-black/10 bg-wise-light-surface/50"
      style={{ gridTemplateColumns: COL_WIDTHS }}
    >
      <div className="py-4 flex items-center justify-center">
        <span className="text-[10px] font-bold text-wise-gray uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Total
        </span>
      </div>

      <div className="px-5 py-4">
        <div className="text-[10px] font-bold text-wise-warm-dark uppercase tracking-wider mb-1">Entradas</div>
        <div className="num font-semibold text-wise-positive">{formatBRL(totalIncome)}</div>
      </div>

      <div className="px-5 py-4">
        <div className="text-[10px] font-bold text-wise-warm-dark uppercase tracking-wider mb-1">Saídas</div>
        <div className="num font-semibold text-wise-danger">{formatBRL(totalExpense)}</div>
      </div>

      <div className="px-5 py-4">
        <div className="text-[10px] font-bold text-wise-warm-dark uppercase tracking-wider mb-1">Poupança</div>
        <div className="num font-semibold text-[#0369a1]">{formatBRL(totalSavings)}</div>
      </div>

      <div className="px-5 py-4">
        <div className="text-[10px] font-bold text-wise-warm-dark uppercase tracking-wider mb-1">Líquido</div>
        <div className={`num font-semibold whitespace-nowrap ${net >= 0 ? 'text-wise-positive' : 'text-wise-danger'}`}>
          {formatBRL(net)}
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-[10px] font-bold text-wise-warm-dark uppercase tracking-wider mb-1">Saldo Final</div>
        <div className={`num font-semibold whitespace-nowrap ${endingBalance >= 0 ? 'text-wise-black' : 'text-wise-danger'}`}>
          {formatBRL(endingBalance)}
        </div>
      </div>
    </div>
  )
}
