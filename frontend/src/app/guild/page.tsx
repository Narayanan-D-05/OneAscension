"use client"

import { DataPanel } from "@/components/ui/DataPanel"
import { HUDButton } from "@/components/ui/HUDButton"
import { RankIndicator } from "@/components/ui/RankIndicator"
import { Users, Trophy, Target, ShieldCheck } from "lucide-react"
import { useSuiClientQuery } from "@mysten/dapp-kit"
import { motion } from "framer-motion"

const LEADERBOARD_ID = process.env.NEXT_PUBLIC_LEADERBOARD_ID;

export default function GuildHall() {
  const { data: boardData, isLoading } = useSuiClientQuery('getObject', {
    id: LEADERBOARD_ID as string,
    options: { showContent: true }
  }, { enabled: !!LEADERBOARD_ID });

  const rawHunters = (boardData?.data?.content as any)?.fields?.top_hunters || [];
  
  // Sort by level descending
  const hunters = [...rawHunters].sort((a: any, b: any) => 
    Number(b.fields.level) - Number(a.fields.level)
  );

  const getRank = (level: number) => {
    if (level >= 80) return "S";
    if (level >= 60) return "A";
    if (level >= 40) return "B";
    if (level >= 20) return "C";
    return "E";
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      {/* Header Section */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-[var(--color-tertiary)]">
          <Trophy size={32} />
          <h1 className="text-4xl font-display font-bold uppercase tracking-widest">Global Guild Hall</h1>
        </div>
        <p className="font-mono text-xs text-[var(--color-outline-variant)] uppercase tracking-[0.3em]">
          Tactical Node // Leaderboard_Protocol_v4.0
        </p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataPanel variant="low" className="flex items-center gap-6">
          <div className="p-4 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Users size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[var(--color-outline-variant)] uppercase">Active Hunters</div>
            <div className="text-2xl font-display text-white">{hunters.length}</div>
          </div>
        </DataPanel>
        <DataPanel variant="low" className="flex items-center gap-6">
          <div className="p-4 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
            <Target size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[var(--color-outline-variant)] uppercase">Avg Instance LV</div>
            <div className="text-2xl font-display text-white">42.8</div>
          </div>
        </DataPanel>
        <DataPanel variant="low" className="flex items-center gap-6">
          <div className="p-4 bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[var(--color-outline-variant)] uppercase">Network Security</div>
            <div className="text-2xl font-display text-green-500">MAX</div>
          </div>
        </DataPanel>
      </div>

      {/* Leaderboard Table */}
      <DataPanel variant="base" className="flex-1 min-h-[500px]">
        <div className="flex justify-between items-center mb-6 border-b border-[var(--color-outline-variant)]/20 pb-4">
          <h3 className="font-display text-sm uppercase tracking-widest text-[var(--color-primary-dim)]">Hunter Rankings [DES]</h3>
          <HUDButton variant="ghost" className="text-[10px] py-1">Refresh Node</HUDButton>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
             <div className="w-12 h-12 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
             <span className="font-mono text-xs text-[var(--color-primary-dim)] uppercase animate-pulse">Synchronizing with OneChain...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {hunters.map((h, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i}
                className="flex items-center gap-6 p-4 bg-[var(--color-surface-container-low)]/50 group hover:bg-[var(--color-surface-bright)]/30 border-l-2 border-transparent hover:border-[var(--color-primary)] transition-all"
              >
                <div className="font-mono text-xl text-[var(--color-outline-variant)] w-8">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                
                <div className="flex-1">
                  <div className="font-display text-lg text-white uppercase tracking-wider">{h.fields.hunter_name}</div>
                  <div className="font-mono text-[10px] text-[var(--color-primary-dim)] uppercase tracking-widest mt-0.5">
                    LEVEL {h.fields.level} // UID: {h.fields.hunter_name.slice(0,4)}-{i.toString().padStart(3, '0')}
                  </div>
                </div>

                <div className="w-24 h-1 bg-[var(--color-surface-container-highest)] relative overflow-hidden hidden md:block">
                  <div className="absolute inset-y-0 left-0 bg-[var(--color-primary)]" style={{ width: `${Math.min(100, (Number(h.fields.level) / 100) * 100)}%` }} />
                </div>

                <RankIndicator rank={getRank(Number(h.fields.level))} />
              </motion.div>
            ))}

            {hunters.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-[var(--color-outline-variant)]/20">
                <span className="font-mono text-[var(--color-outline-variant)] uppercase tracking-widest">No Hunter Records Found in this Instance</span>
              </div>
            )}
          </div>
        )}
      </DataPanel>
    </div>
  )
}
