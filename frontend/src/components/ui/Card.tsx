// src/components/ui/Card.tsx
import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-card rounded-xl shadow-sm p-6', className)}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

Card.Title = function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cn('text-lg font-semibold text-gray-800', className)}>{children}</h3>
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

Card.Content = function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn('mt-6 pt-4 border-t border-gray-100', className)}>{children}</div>
}

export { Card }