import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-background border border-border rounded-lg shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
