import { type ClassValue } from 'clsx';
/**
 * Utility for merging Tailwind CSS classes with proper precedence.
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 *
 * @example
 * cn('px-4 py-2', 'bg-primary', className)
 * cn('text-sm', isActive && 'font-bold', className)
 */
export declare function cn(...inputs: ClassValue[]): string;
