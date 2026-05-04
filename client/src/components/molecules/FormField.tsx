import { Label } from '../atoms/Label'

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

export function FormField({ label, htmlFor, required, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} required={required}>{label}</Label>
      {children}
      {error && <p className="text-xs text-wise-danger">{error}</p>}
    </div>
  )
}
