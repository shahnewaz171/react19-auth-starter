import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';
import { type VariantProps, cva } from 'class-variance-authority';

import cn from '@/utils/cn';

const buttonVariants = cva('', {
  variants: {
    customVariant: {
      gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
      glass: 'backdrop-blur-sm bg-white/10 border border-white/20'
    }
  },
  defaultVariants: {
    customVariant: undefined
  }
});

export interface ButtonProps extends MuiButtonProps, VariantProps<typeof buttonVariants> {
  customVariant?: 'gradient' | 'glass';
}

export function Button({
  className,
  customVariant,
  variant = 'contained',
  color = 'primary',
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      variant={variant}
      color={color}
      className={cn(buttonVariants({ customVariant }), className)}
      {...props}
    />
  );
}
