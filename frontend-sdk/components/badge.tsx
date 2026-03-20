import React from 'react';
import type { BadgeVariant } from '../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--rubix-primary)] text-[var(--rubix-primary-foreground)] hover:opacity-90',
  secondary: 'bg-[var(--rubix-secondary)] text-[var(--rubix-secondary-foreground)] hover:opacity-90',
  destructive: 'bg-[var(--rubix-destructive)] text-[var(--rubix-destructive-foreground)] hover:opacity-90',
  outline: 'border border-[var(--rubix-border)] text-[var(--rubix-foreground)]',
  success: 'bg-[oklch(0.7_0.15_145)] text-white',
  warning: 'bg-[oklch(0.75_0.15_85)] text-[oklch(0.2_0_0)]',
};

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variantClass = variantStyles[variant];

  return (
    <div className={`${baseStyles} ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
