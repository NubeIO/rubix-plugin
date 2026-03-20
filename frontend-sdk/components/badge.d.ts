import React from 'react';
import type { BadgeVariant } from '../types';
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    children: React.ReactNode;
}
export declare function Badge({ variant, className, children, ...props }: BadgeProps): any;
