import React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function Card({ className, children, ...props }: CardProps): import("react/jsx-runtime").JSX.Element;
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function CardHeader({ className, children, ...props }: CardHeaderProps): import("react/jsx-runtime").JSX.Element;
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export declare function CardTitle({ className, children, ...props }: CardTitleProps): import("react/jsx-runtime").JSX.Element;
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}
export declare function CardDescription({ className, children, ...props }: CardDescriptionProps): import("react/jsx-runtime").JSX.Element;
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function CardContent({ className, children, ...props }: CardContentProps): import("react/jsx-runtime").JSX.Element;
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function CardFooter({ className, children, ...props }: CardFooterProps): import("react/jsx-runtime").JSX.Element;
