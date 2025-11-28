import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground flex items-center selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        destructive:
          "border-destructive focus-visible:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        invisible:
          "border-transparent focus-visible:ring-0 focus-visible:border-transparent shadow-none !px-0",
      },
      size: {
        sm: "h-8 px-2 py-0 text-sm",
        md: "h-9 px-3 py-1 text-base md:text-sm",
        lg: "h-10 px-4 py-2 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type InputVariants = VariantProps<typeof inputVariants>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  variant?: InputVariants["variant"];
}

function Input({ className, type, variant = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants, type InputVariants };
