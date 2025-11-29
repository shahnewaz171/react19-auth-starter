import { TextField, type TextFieldProps } from '@mui/material';
import { type VariantProps, cva } from 'class-variance-authority';

import cn from '@/utils/cn';

const inputVariants = cva('', {
  variants: {
    inputSize: {
      small: 'text-sm',
      medium: '',
      large: 'text-lg'
    }
  },
  defaultVariants: {
    inputSize: 'medium'
  }
});

export interface InputProps
  extends Omit<TextFieldProps, 'size'>, VariantProps<typeof inputVariants> {
  inputSize?: 'small' | 'medium' | 'large';
}

const Input = ({ className, inputSize = 'medium', error, helperText, ...props }: InputProps) => {
  const muiSize = inputSize === 'large' ? 'medium' : inputSize;

  return (
    <TextField
      size={muiSize}
      error={error}
      helperText={helperText}
      className={cn(inputVariants({ inputSize }), className)}
      fullWidth
      {...props}
    />
  );
};

export { Input, inputVariants };
