import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] relative overflow-hidden group/btn',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg rounded-full',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full',
        outline:
          'border border-black/15 bg-transparent text-black hover:bg-black hover:text-white hover:border-black rounded-full',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full',
        ghost: 'hover:bg-accent/10 hover:text-accent rounded-full',
        link: 'text-primary underline-offset-4 hover:underline',
        accent:
          'gradient-accent text-white hover:shadow-glow rounded-full font-semibold',
        glass:
          'glass text-black hover:bg-white/90 hover:shadow-premium rounded-full font-semibold',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-14 px-10 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
