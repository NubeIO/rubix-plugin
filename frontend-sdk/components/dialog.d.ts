import React from 'react';
export interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}
export declare function Dialog({ open, onOpenChange, children }: DialogProps): import("react/jsx-runtime").JSX.Element | null;
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function DialogContent({ className, children, ...props }: DialogContentProps): import("react/jsx-runtime").JSX.Element;
export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function DialogHeader({ className, children, ...props }: DialogHeaderProps): import("react/jsx-runtime").JSX.Element;
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export declare function DialogTitle({ className, children, ...props }: DialogTitleProps): import("react/jsx-runtime").JSX.Element;
export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}
export declare function DialogDescription({ className, children, ...props }: DialogDescriptionProps): import("react/jsx-runtime").JSX.Element;
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function DialogFooter({ className, children, ...props }: DialogFooterProps): import("react/jsx-runtime").JSX.Element;
