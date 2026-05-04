interface LabelProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
}

export function Label({ children, htmlFor, required }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-wise-warm-dark">
      {children}
      {required && <span className="text-wise-danger ml-1">*</span>}
    </label>
  )
}
