import { cn } from "@/lib/utils"

type Rank = "G" | "F" | "E" | "D" | "C" | "B" | "A" | "S"

interface RankIndicatorProps {
  rank: Rank;
  className?: string;
}

export function RankIndicator({ rank, className }: RankIndicatorProps) {
  const styles = {
    G: "text-[var(--color-outline-variant)] bg-[var(--color-surface-variant)] border-[var(--color-outline)]",
    F: "text-[var(--color-outline-variant)] bg-[var(--color-surface-variant)] border-[var(--color-outline)]",
    E: "text-[var(--color-outline-variant)] bg-[var(--color-surface-variant)] border-[var(--color-outline)]",
    D: "text-[var(--color-outline-variant)] bg-[var(--color-surface-variant)] border-[var(--color-outline)]",
    C: "text-[var(--color-primary-dim)] border-[var(--color-primary-dim)] shadow-[0_0_2px_var(--color-primary-dim)]",
    B: "text-[var(--color-primary-dim)] border-[var(--color-primary-dim)] shadow-[0_0_4px_var(--color-primary-dim)]",
    A: "text-[var(--color-secondary)] border-[var(--color-secondary)] shadow-[0_0_8px_var(--color-secondary)]",
    S: "text-[var(--color-tertiary)] border-[var(--color-tertiary)] shadow-[0_0_15px_var(--color-tertiary)] animate-pulse",
  }

  return (
    <div
      className={cn(
        "inline-flex font-display items-center justify-center w-8 h-8 md:w-12 md:h-12 border-2 text-lg md:text-2xl font-bold uppercase",
        styles[rank],
        className
      )}
    >
      {rank}
    </div>
  )
}
