import { LabelHTMLAttributes, ReactNode } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={`text-sm font-medium text-foreground ${className}`} {...props}>
      {children}
    </label>
  )
}
