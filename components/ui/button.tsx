import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded transition-colors duration-200 cursor-pointer'
  
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-blue-600',
    outline: 'border border-border text-foreground hover:bg-muted',
    ghost: 'text-foreground hover:bg-muted',
  }

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const disabledStyles = props.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
