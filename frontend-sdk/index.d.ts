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
export { createPluginClient, usePluginClient, PluginClient, PluginClientError } from './plugin-client';
export type { PluginClientConfig, QueryNodesOptions, CreateNodeInput, UpdateNodeInput } from './plugin-client';
export type { PluginWidgetProps, PluginPageProps, RubixApiResponse, RubixNode, QueryResult, ButtonVariant, ButtonSize, BadgeVariant, } from './types';
export { RASClient, fetchAdapter } from './ras/client';
export type { Node, Edge, Ref } from './ras/types';
