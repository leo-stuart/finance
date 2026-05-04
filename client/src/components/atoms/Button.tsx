import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-wise-green text-wise-dark-green hover:scale-105 active:scale-95',
  secondary: 'bg-[rgba(22,51,0,0.08)] text-wise-black hover:scale-105 active:scale-95',
  ghost: 'bg-transparent text-wise-black hover:bg-wise-light-surface hover:scale-105 active:scale-95',
  danger: 'bg-[rgba(208,50,56,0.1)] text-wise-danger hover:scale-105 active:scale-95',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`
        font-semibold rounded-full transition-transform duration-150 cursor-pointer
        inline-flex items-center gap-2 select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
