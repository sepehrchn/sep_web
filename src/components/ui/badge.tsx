import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-white shadow-sm hover:bg-accent-hover",
        secondary:
          "border-transparent bg-[var(--c-neutral-150)] text-[var(--c-primary)] hover:bg-[var(--c-neutral-200)]",
        destructive:
          "border-transparent bg-[var(--c-danger)] text-white shadow-sm hover:bg-[var(--c-danger)]/90",
        outline: "text-[var(--c-primary)] border-[var(--border)]",
        success: "border-transparent bg-[var(--c-success)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
