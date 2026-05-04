interface BadgeProps {
  color?: string
  children: React.ReactNode
  className?: string
}

export function Badge({ color = '#9fe870', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{
        backgroundColor: `${color}20`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {children}
    </span>
  )
}
