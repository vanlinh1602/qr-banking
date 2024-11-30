import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
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

const ButtonHover2 = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactElement;
    className?: string;
  }
>(({ className, icon, children, ...props }, ref) => {
  return (
    <>
      <button
        className={`group relative inline-flex h-9 w-9 items-center 
          justify-center overflow-hidden rounded-full bg-gradient-to-r 
          dark:from-[#070e41] dark:to-[#263381] 
          from-secondary to-primary  font-medium 
          text-neutral-50 border-2 border-primary transition-all 
          duration-300 hover:w-32 ${className}`}
        ref={ref}
        {...props}
      >
        <div className="inline-flex whitespace-nowrap opacity-0 transition-all duration-200 group-hover:-translate-x-3 group-hover:opacity-100">
          {children}
        </div>
        <div className="absolute right-1">{icon}</div>
      </button>
    </>
  );
});

const ButtonHover3 = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <>
      <button
        className={`group relative inline-flex h-9 items-center justify-center overflow-hidden 
          rounded-md bg-gradient-to-r dark:from-[#070e41] dark:to-[#263381] from-[#f6f7ff] to-[#f5f6ff] 
          dark:border-[rgb(76_100_255)] border-2 border-primary bg-transparent px-6 font-medium 
          dark:text-white text-gray-600 transition-all duration-100 
          dark:[box-shadow:5px_5px_rgb(76_100_255)] [box-shadow:5px_5px_rgb(224_82_105)] 
          active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(224_82_1059)] 
          dark:active:[box-shadow:0px_0px_rgb(76_100_255)] ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    </>
  );
});

export default ButtonHover3;

export { Button, buttonVariants, ButtonHover3, ButtonHover2 };
