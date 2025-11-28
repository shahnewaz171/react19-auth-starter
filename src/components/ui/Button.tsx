import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { cn } from '@/utils';

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700',
  secondary: 'bg-gray-600 hover:bg-gray-700'
};

const baseClasses =
  'inline-flex items-center justify-center px-4 py-2 rounded text-white font-semibold transition';

interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: keyof typeof variantClasses;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  onClick,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    className={cn(
      baseClasses,
      variantClasses[variant],
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
