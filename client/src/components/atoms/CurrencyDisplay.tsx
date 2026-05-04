import { formatBRL } from '../../utils/finance'

interface CurrencyDisplayProps {
  amount: number
  variant?: 'income' | 'expense' | 'savings' | 'neutral' | 'balance'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showSign?: boolean
  className?: string
}

const colors = {
  income: 'text-wise-positive',
  expense: 'text-wise-danger',
  savings: 'text-[#0369a1]',
  neutral: 'text-wise-black',
  balance: 'text-wise-black',
}

const sizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
}

export function CurrencyDisplay({
  amount,
  variant = 'neutral',
  size = 'md',
  showSign = false,
  className = '',
}: CurrencyDisplayProps) {
  const autoVariant = variant === 'balance'
    ? amount < 0 ? 'expense' : 'neutral'
    : variant

  return (
    <span className={`num font-medium ${colors[autoVariant]} ${sizes[size]} ${className}`}>
      {showSign && amount > 0 ? '+' : ''}
      {formatBRL(amount)}
    </span>
  )
}
