import React from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function Card({ className, children, ...props }: CardProps): any;
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function CardHeader({ className, children, ...props }: CardHeaderProps): any;
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export declare function CardTitle({ className, children, ...props }: CardTitleProps): any;
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}
export declare function CardDescription({ className, children, ...props }: CardDescriptionProps): any;
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function CardContent({ className, children, ...props }: CardContentProps): any;
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare function CardFooter({ className, children, ...props }: CardFooterProps): any;
