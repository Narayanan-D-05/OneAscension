import * as React from "react"
import { cn } from "@/lib/utils"

interface HUDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "glitch";
}

export const HUDButton = React.forwardRef<HTMLButtonElement, HUDButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center px-6 py-2 uppercase tracking-widest text-sm font-medium transition-all duration-200",
          variant === "primary" && "bg-[var(--color-primary)] text-[var(--color-background)] border-b-2 border-b-[var(--color-primary-fixed-dim)] hover:bg-[var(--color-primary-container)] active:border-b-0 active:translate-y-[2px]",
          variant === "ghost" && "border border-[var(--color-primary)]/40 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]",
          variant === "glitch" && "bg-[var(--color-tertiary)] text-black font-display font-bold border-b-2 border-b-[var(--color-tertiary-container)] shadow-[0_0_15px_var(--color-tertiary)] hover:opacity-80 active:border-b-0 active:translate-y-[2px]",
          className
        )}
        {...props}
      />
    )
  }
)
HUDButton.displayName = "HUDButton"
