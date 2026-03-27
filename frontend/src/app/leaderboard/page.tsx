"use client"

import { DataPanel } from "@/components/ui/DataPanel"
import { HUDButton } from "@/components/ui/HUDButton"
import { RankIndicator } from "@/components/ui/RankIndicator"
import { Trophy, TrendingUp } from "lucide-react"

export default function Leaderboard() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] p-4 md:p-8 flex flex-col gap-8 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <header className="flex justify-between items-start z-10 w-full">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-[var(--color-tertiary)] flex items-center gap-3">
            <Trophy size={28} /> TOWER RANKINGS // SEASON 1
          </h1>
          <p className="font-mono text-xs text-[var(--color-tertiary)]/70 uppercase tracking-widest mt-1">Live On-Chain Data // Sync: Realtime</p>
        </div>
        <div className="hidden md:flex gap-4">
          <HUDButton variant="ghost">My Rank</HUDButton>
          <HUDButton variant="primary">Claim Season Rewards</HUDButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 z-10 flex-1 mt-4">
        
        {/* Top 3 Podium (S-Rank Focus) */}
        <section className="md:col-span-12 flex flex-col md:flex-row justify-center items-end gap-6 h-64 mb-8">
           
           {/* Rank 2 */}
           <DataPanel variant="high" className="w-full max-w-xs flex flex-col items-center p-6 border-t-2 border-[var(--color-secondary)] h-48 justify-end">
              <RankIndicator rank="S" className="mb-4 scale-75 opacity-80" />
              <h3 className="font-display uppercase tracking-widest text-lg text-[var(--color-foreground)]">0x91...B34</h3>
              <p className="font-mono text-xs text-[var(--color-secondary)]">Floor 99</p>
              <div className="absolute top-2 left-2 text-4xl font-display font-bold text-[var(--color-surface-container-highest)]">2</div>
           </DataPanel>
           
           {/* Rank 1 */}
           <DataPanel variant="base" glowing className="w-full max-w-sm flex flex-col items-center p-8 border-t-4 border-[var(--color-tertiary)] h-64 justify-end shadow-[0_-20px_50px_var(--color-tertiary)]/10">
              <RankIndicator rank="S" className="mb-6 scale-125" />
              <h3 className="font-display uppercase tracking-widest text-2xl text-[var(--color-tertiary)] drop-shadow-[0_0_8px_var(--color-tertiary)]">0x34...A12</h3>
              <p className="font-mono text-sm text-[var(--color-tertiary-dim)] mb-2">Floor 100 [CLEARED]</p>
              <div className="absolute top-2 left-2 text-6xl font-display font-bold text-[var(--color-surface-container)]">1</div>
           </DataPanel>

           {/* Rank 3 */}
           <DataPanel variant="high" className="w-full max-w-xs flex flex-col items-center p-6 border-t-2 border-[var(--color-secondary)] h-40 justify-end">
              <RankIndicator rank="A" className="mb-4 scale-75 opacity-80" />
              <h3 className="font-display uppercase tracking-widest text-lg text-[var(--color-foreground)]">0xAA...112</h3>
              <p className="font-mono text-xs text-[var(--color-secondary)]">Floor 95</p>
              <div className="absolute top-2 left-2 text-4xl font-display font-bold text-[var(--color-surface-container-highest)]">3</div>
           </DataPanel>
        </section>

        {/* Leaderboard Table */}
        <section className="md:col-span-12">
          <DataPanel variant="low" className="w-full max-w-5xl mx-auto">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--color-primary-dim)] mb-6 flex items-center gap-2">
               <TrendingUp size={16}/> Global Hierarchy
            </h3>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-surface-container-highest)] font-display text-xs uppercase tracking-widest text-[var(--color-outline-variant)]">
                  <th className="pb-4 font-medium pl-4">Rank</th>
                  <th className="pb-4 font-medium">Hunter ID</th>
                  <th className="pb-4 font-medium">Class</th>
                  <th className="pb-4 font-medium text-right pr-4">Highest Floor</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                {[
                  { rank: 4, id: "0x12...99A", class: "Tank", floor: 88, ind: "A" },
                  { rank: 5, id: "0x56...FF1", class: "Mage", floor: 85, ind: "B" },
                  { rank: 6, id: "0x44...01B", class: "Assassin", floor: 82, ind: "B" },
                  { rank: 7, id: "0x98...33C", class: "Healer", floor: 79, ind: "C" },
                  { rank: 8, id: "0x77...88D", class: "Sword", floor: 70, ind: "C" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[var(--color-surface-container-highest)]/50 hover:bg-[var(--color-surface-container)] transition-colors">
                    <td className="py-4 pl-4 text-[var(--color-outline-variant)]">#{row.rank}</td>
                    <td className="py-4 text-[var(--color-foreground)] flex items-center gap-4">
                      <RankIndicator rank={row.ind as any} className="w-6 h-6 text-xs border" />
                      {row.id}
                    </td>
                    <td className="py-4 text-[var(--color-outline-variant)]">{row.class}</td>
                    <td className="py-4 text-right pr-4 text-[var(--color-primary)]">{row.floor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataPanel>
        </section>
      </div>
    </main>
  )
}
