/**
 * Rubix Plugin UI SDK
 *
 * Common UI components and utilities for building Rubix plugins.
 * Import this package to get consistent styling and behavior across all plugins.
 *
 * @example
 * ```tsx
 * import { Button, Card, Input, createPluginClient } from '@rubix/plugin-ui';
 * import type { PluginWidgetProps } from '@rubix/plugin-ui/types';
 * import '@rubix/plugin-ui/styles.css';
 *
 * export default function MyWidget(props: PluginWidgetProps) {
 *   const client = createPluginClient(props);
 *
 *   return (
 *     <Card>
 *       <CardHeader>
 *         <CardTitle>My Widget</CardTitle>
 *       </CardHeader>
 *       <CardContent>
 *         <Button onClick={handleClick}>Click me</Button>
 *       </CardContent>
 *     </Card>
 *   );
 * }
 * ```
 */
export { Button } from './components/button';
export type { ButtonProps } from './components/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/card';
export type { CardProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps } from './components/card';
export { Input } from './components/input';
export type { InputProps } from './components/input';
export { Label } from './components/label';
export type { LabelProps } from './components/label';
export { Badge } from './components/badge';
export type { BadgeProps } from './components/badge';
export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/dialog';
export type { DialogProps, DialogContentProps, DialogHeaderProps, DialogTitleProps, DialogDescriptionProps, DialogFooterProps } from './components/dialog';
export { Skeleton } from './components/skeleton';
export type { SkeletonProps } from './components/skeleton';
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
export interface PluginWidgetProps {
    orgId?: string;
    deviceId?: string;
    baseUrl?: string;
    token?: string;
    settings?: Record<string, unknown>;
    config?: Record<string, unknown>;
}
export interface PluginPageProps {
    orgId?: string;
    deviceId?: string;
    baseUrl?: string;
    token?: string;
}
export interface RubixApiResponse<T> {
    data: T;
    meta?: {
        timestamp?: string;
        total?: number;
        [key: string]: unknown;
    };
}
export interface RubixNode {
    id: string;
    name: string;
    type: string;
    parentId?: string;
    settings?: Record<string, unknown>;
    data?: Record<string, unknown>;
    ui?: Record<string, unknown>;
    position?: {
        x: number;
        y: number;
    };
    createdAt?: string;
    updatedAt?: string;
}
export interface QueryResult {
    nodes: RubixNode[];
    total: number;
}
export { RASClient, fetchAdapter } from './ras/client';
export type { Node } from './ras/types';
export { cn } from './lib/utils';
