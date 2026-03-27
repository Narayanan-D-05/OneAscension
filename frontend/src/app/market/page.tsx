"use client"

import { DataPanel } from "@/components/ui/DataPanel"
import { HUDButton } from "@/components/ui/HUDButton"
import { ShoppingBag, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Gem, Ghost, Sword } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function MarketPage() {
  const [filter, setFilter] = useState('ALL')

  const mockListings = [
    { name: "S-Rank: Igris", type: "SHADOW", price: "2,500", trend: "up", seller: "0x6ce3...1e1" },
    { name: "Kamish's Wrath", type: "WEAPON", price: "12,000", trend: "down", seller: "0x4fe2...a9b" },
    { name: "Baran's Longsword", type: "WEAPON", price: "8,200", trend: "up", seller: "0xac23...881" },
    { name: "A-Rank: Tank", type: "SHADOW", price: "1,200", trend: "up", seller: "0x992b...c1d" },
  ]

  return (
    <div className="p-8 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-[var(--color-primary)]">
          <ShoppingBag size={32} />
          <h1 className="text-4xl font-display font-bold uppercase tracking-widest">Shadow Market</h1>
        </div>
        <p className="font-mono text-xs text-[var(--color-outline-variant)] uppercase tracking-[0.3em]">
          Tactical Exchange // Finance_Protocol_v9.2
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Market Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <DataPanel variant="low" glowing>
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--color-primary-dim)] mb-6 flex items-center gap-2">
              <BarChart3 size={18} /> Exchange Metrics
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] text-[var(--color-outline-variant)] uppercase tracking-widest">Global Vol. (24h)</span>
                  <span className="text-green-400 flex items-center gap-1 text-[10px] font-mono"><ArrowUpRight size={12}/> +12.4%</span>
                </div>
                <div className="text-2xl font-display text-white">458,290 OCT</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] text-[var(--color-outline-variant)] uppercase tracking-widest">S-Rank Floor</span>
                  <span className="text-red-400 flex items-center gap-1 text-[10px] font-mono"><ArrowDownRight size={12}/> -2.1%</span>
                </div>
                <div className="text-2xl font-display text-white">14,200 OCT</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[10px] text-[var(--color-outline-variant)] uppercase tracking-widest">Total Listings</span>
                  <span className="text-[var(--color-primary)] text-[10px] font-mono tracking-tighter">NODE_SYNCED</span>
                </div>
                <div className="text-2xl font-display text-white">1,248</div>
              </div>
            </div>

            <div className="mt-8 h-20 w-full relative overflow-hidden">
               {/* Decorative Sparkline */}
               <svg className="w-full h-full stroke-[var(--color-primary)] opacity-30 fill-none" preserveAspectRatio="none">
                 <path d="M0 60 L20 40 L40 55 L60 20 L80 45 L100 10 L120 50 L140 30 L160 55 L180 20 L200 40 L220 50 L240 15 L260 45 L280 25 L300 60" />
               </svg>
            </div>
          </DataPanel>

          <DataPanel variant="base" className="border-l-2 border-[var(--color-tertiary)] bg-gradient-to-br from-[var(--color-tertiary)]/5 to-transparent">
             <div className="flex items-center gap-3 text-[var(--color-tertiary)] mb-2">
               <Gem size={20} />
               <span className="font-display text-xs uppercase tracking-widest font-bold">VIP Status Active</span>
             </div>
             <p className="font-mono text-[9px] text-[var(--color-outline-variant)] uppercase leading-relaxed">
               As an S-Rank hunter, your trading fees are reduced to 0.5% per successful extraction exchange.
             </p>
          </DataPanel>
        </div>

        {/* Listings Section (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-[var(--color-outline-variant)]/20 pb-4">
             <div className="flex gap-4">
               {['ALL', 'WEAPONS', 'SHADOWS'].map((tab) => (
                 <button 
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "font-display text-[10px] tracking-[0.2em] uppercase transition-colors px-4 py-2",
                    filter === tab ? "bg-[var(--color-primary)] text-black font-bold" : "text-[var(--color-outline-variant)] hover:text-white"
                  )}
                 >
                   {tab}
                 </button>
               ))}
             </div>
             <div className="font-mono text-[10px] text-[var(--color-outline-variant)]">
               QUERY_TIME: 4ms
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockListings.map((listing, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={i}
              >
                <DataPanel variant="low" className="group cursor-pointer hover:border-[var(--color-primary)]/50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 border border-[var(--color-outline-variant)]/20 text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors group-hover:border-[var(--color-primary)]/40">
                      {listing.type === "SHADOW" ? <Ghost size={24} /> : <Sword size={24} />}
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl text-white font-bold">{listing.price} <span className="text-[var(--color-primary)]">OCT</span></div>
                      <div className={cn(
                        "font-mono text-[10px] uppercase flex items-center gap-1 justify-end",
                        listing.trend === "up" ? "text-green-500" : "text-red-500"
                      )}>
                        {listing.trend === "up" ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} 
                        {listing.trend === "up" ? 'Bullish' : 'Bearish'}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-lg text-white uppercase tracking-widest mb-1">{listing.name}</h3>
                  <div className="font-mono text-[10px] text-[var(--color-outline-variant)] uppercase mb-6">
                    Seller: {listing.seller}
                  </div>

                  <HUDButton variant="primary" className="w-full py-2">PURCHASE EXTRACT</HUDButton>
                </DataPanel>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center py-8">
             <HUDButton variant="ghost" className="px-12 text-xs">Load More Listings</HUDButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
