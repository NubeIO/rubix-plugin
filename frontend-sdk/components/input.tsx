import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-[var(--rubix-radius-md)] border border-[var(--rubix-input)] bg-[var(--rubix-background)] px-3 py-2 text-sm ring-offset-[var(--rubix-background)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--rubix-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rubix-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
