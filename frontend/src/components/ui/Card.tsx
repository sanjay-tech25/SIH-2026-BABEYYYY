import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
};

export function Card({ children, className = '', as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={`rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
      
      {children}
    </Tag>);

}