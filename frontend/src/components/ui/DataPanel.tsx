import { cn } from "@/lib/utils"

interface DataPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'base' | 'low' | 'high' | 'highest';
  glowing?: boolean;
}

export function DataPanel({ children, className, variant = 'base', glowing = false, ...props }: DataPanelProps) {
  const backgrounds = {
    base: 'bg-[var(--color-surface-container)]/70',
    low: 'bg-[var(--color-surface-container-low)]/70',
    high: 'bg-[var(--color-surface-container-high)]/70',
    highest: 'bg-[var(--color-surface-container-highest)]/70',
  }

  return (
    <div
      className={cn(
        "relative p-6 glass-panel ambient-shadow overflow-hidden transition-all duration-500",
        backgrounds[variant],
        glowing ? "glow-trace" : "border-t border-l border-[var(--color-outline-variant)]/10",
        className
      )}
      {...props}
    >
      {/* Decorative corners mapping to the 'System' HUD aesthetic */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--color-primary-dim)] opacity-30 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--color-primary-dim)] opacity-30 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">{children}</div>
    </div>
  )
}
