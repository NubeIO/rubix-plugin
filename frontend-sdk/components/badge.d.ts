import React from 'react';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    children: React.ReactNode;
}
export declare function Badge({ variant, className, children, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
