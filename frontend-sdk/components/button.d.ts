import React from 'react';
import type { ButtonVariant, ButtonSize } from '../types';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
}
export declare function Button({ variant, size, className, children, ...props }: ButtonProps): any;
