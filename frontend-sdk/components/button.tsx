import React from 'react';
import type { ButtonVariant, ButtonSize } from '../types';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-[var(--rubix-primary)] text-[var(--rubix-primary-foreground)] hover:opacity-90',
  destructive: 'bg-[var(--rubix-destructive)] text-[var(--rubix-destructive-foreground)] hover:opacity-90',
  outline: 'border border-[var(--rubix-border)] bg-transparent hover:bg-[var(--rubix-accent)]',
  secondary: 'bg-[var(--rubix-secondary)] text-[var(--rubix-secondary-foreground)] hover:opacity-90',
  ghost: 'bg-transparent hover:bg-[var(--rubix-accent)]',
  link: 'bg-transparent underline-offset-4 hover:underline text-[var(--rubix-primary)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8',
};

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[var(--rubix-radius-md)] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none';
  const variantClass = variantStyles[variant];
  const sizeClass = sizeStyles[size];

  return (
    <button
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
