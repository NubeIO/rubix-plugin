import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-[var(--rubix-radius-md)] bg-[var(--rubix-muted)] ${className}`}
      {...props}
    />
  );
}
