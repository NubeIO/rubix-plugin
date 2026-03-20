import React from 'react';
export interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}
export declare function Dialog({ open, onOpenChange, children }: DialogProps): any;
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function DialogContent({ className, children, ...props }: DialogContentProps): any;
export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function DialogHeader({ className, children, ...props }: DialogHeaderProps): any;
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export declare function DialogTitle({ className, children, ...props }: DialogTitleProps): any;
export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}
export declare function DialogDescription({ className, children, ...props }: DialogDescriptionProps): any;
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function DialogFooter({ className, children, ...props }: DialogFooterProps): any;
