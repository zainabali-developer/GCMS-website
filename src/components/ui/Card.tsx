import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export default function Card({ children, padded = true, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-ink-100 bg-white shadow-card ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
