import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ className = '', error, ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-3 py-2 rounded-[10px] border
        font-medium text-wise-black bg-white
        focus:outline-none focus:ring-1 focus:ring-inset focus:ring-wise-gray
        placeholder:text-wise-gray placeholder:font-normal
        transition-shadow duration-150
        ${error ? 'border-wise-danger' : 'border-[rgba(14,15,12,0.15)]'}
        ${className}
      `}
      {...props}
    />
  )
}
