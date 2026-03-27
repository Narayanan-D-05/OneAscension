"use client"

import { DataPanel } from "@/components/ui/DataPanel"
import { HUDButton } from "@/components/ui/HUDButton"
import { Shield, Sword, Ghost, Zap, Crosshair, Battery } from "lucide-react"
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit"
import { motion } from "framer-motion"

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID;

export default function ArmoryPage() {
  const account = useCurrentAccount();
  
  const { data: ownedObjects } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address as string,
    filter: { StructType: `${PACKAGE_ID}::hunter::Hunter` },
    options: { showContent: true }
  }, { enabled: !!account });

  const hunter = ownedObjects?.data[0]?.data;
  const hFields = (hunter?.content as any)?.fields;

  // Fetch Active Weapon
  const { data: weaponField } = useSuiClientQuery('getDynamicFieldObject', {
    parentId: hunter?.objectId as string,
    name: { type: 'vector<u8>', value: Array.from(new TextEncoder().encode("active_weapon")) }
  }, { enabled: !!hunter?.objectId });

  // Fetch Active Shadow
  const { data: shadowField } = useSuiClientQuery('getDynamicFieldObject', {
    parentId: hunter?.objectId as string,
    name: { type: 'vector<u8>', value: Array.from(new TextEncoder().encode("active_shadow")) }
  }, { enabled: !!hunter?.objectId });

  const weapon = (weaponField?.data?.content as any)?.fields;
  const shadow = (shadowField?.data?.content as any)?.fields;

  return (
    <div className="p-8 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-[var(--color-secondary)]">
          <Shield size={32} />
          <h1 className="text-4xl font-display font-bold uppercase tracking-widest">The Armory</h1>
        </div>
        <p className="font-mono text-xs text-[var(--color-outline-variant)] uppercase tracking-[0.3em]">
          Secure Vault // Inventory_Management_v2.1
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Equipped Items (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weapon Slot */}
            <DataPanel variant="high" className="min-h-[350px] flex flex-col items-center justify-center p-8 group">
              <div className="absolute top-4 left-4 text-[var(--color-primary-dim)] font-mono text-[10px] tracking-widest">SLOT.01 [PRIMARY_WEAPON]</div>
              
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={cn(
                  "w-24 h-24 mb-6 flex items-center justify-center border-2 rotate-45 transition-all duration-500",
                  weapon ? "border-[var(--color-primary)] text-[var(--color-primary)] shadow-[0_0_30px_var(--color-primary)]/30" : "border-[var(--color-outline-variant)]/30 text-[var(--color-outline-variant)]"
                )}
              >
                <div className="-rotate-45">
                  <Sword size={40} />
                </div>
              </motion.div>

              <h2 className="text-2xl font-display uppercase tracking-[0.2em] text-white">
                {weapon ? weapon.name : "Unarmed"}
              </h2>
              <div className="mt-4 flex flex-col items-center gap-1">
                <span className="font-mono text-xs text-[var(--color-primary-dim)] uppercase tracking-widest">
                  {weapon ? `Tier: Legendary // +${weapon.str_bonus} STR` : "No Weapon Detected"}
                </span>
                <div className="w-32 h-1 bg-[var(--color-surface-container-highest)] mt-2">
                  <div className="h-full bg-[var(--color-primary)] transition-all" style={{ width: weapon ? '100%' : '0%' }} />
                </div>
              </div>

              <HUDButton variant="ghost" className="mt-8 px-8 text-[10px]">RECALIBRATE</HUDButton>
            </DataPanel>

            {/* Shadow Slot */}
            <DataPanel variant="high" className="min-h-[350px] flex flex-col items-center justify-center p-8 group">
              <div className="absolute top-4 left-4 text-[var(--color-tertiary-dim)] font-mono text-[10px] tracking-widest">SLOT.02 [EXTRACTED_SHADOW]</div>
              
              <motion.div 
                animate={shadow ? { opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 3 }}
                className={cn(
                  "w-24 h-24 mb-6 flex items-center justify-center border-2 rotate-45 transition-all duration-500",
                  shadow ? "border-[var(--color-tertiary)] text-[var(--color-tertiary)] shadow-[0_0_30px_var(--color-tertiary)]/30" : "border-[var(--color-outline-variant)]/30 text-[var(--color-outline-variant)]"
                )}
              >
                <div className="-rotate-45">
                  <Ghost size={40} />
                </div>
              </motion.div>

              <h2 className="text-2xl font-display uppercase tracking-[0.2em] text-white">
                {shadow ? shadow.boss_name : "Void"}
              </h2>
              <div className="mt-4 flex flex-col items-center gap-1">
                <span className="font-mono text-xs text-[var(--color-tertiary-dim)] uppercase tracking-widest">
                  {shadow ? `BOND: SYNCED // +${shadow.bonus_str} STR` : "Shadowless"}
                </span>
                <HUDButton variant="glitch" className="mt-4 px-8 text-[10px]">RELEASE ARISE</HUDButton>
              </div>
            </DataPanel>
          </div>

          {/* Collection Grid */}
          <DataPanel variant="low" className="flex-1">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--color-primary-dim)] mb-6">Historical Acquisitions</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square border border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-low)] flex items-center justify-center group cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors">
                  <div className="font-mono text-[8px] text-[var(--color-outline-variant)] opacity-0 group-hover:opacity-100 transition-opacity">EMPTY_{i.toString().padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          </DataPanel>
        </div>

        {/* Right: Detailed Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <DataPanel variant="base" glowing className="flex flex-col gap-6">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--color-primary)] border-b border-[var(--color-outline-variant)]/20 pb-4">Combat Parameters</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[var(--color-outline-variant)] uppercase flex items-center gap-2"><Crosshair size={14} className="text-[var(--color-error)]" /> STRENGTH</span>
                  <span className="text-white">{hFields?.str || 0}</span>
                </div>
                <div className="h-1 w-full bg-[var(--color-surface-container-highest)]">
                  <div className="h-full bg-[var(--color-error)]" style={{ width: '65%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[var(--color-outline-variant)] uppercase flex items-center gap-2"><Battery size={14} className="text-[var(--color-secondary)]" /> INTELLIGENCE</span>
                  <span className="text-white">{hFields?.int || 0}</span>
                </div>
                <div className="h-1 w-full bg-[var(--color-surface-container-highest)]">
                  <div className="h-full bg-[var(--color-secondary)]" style={{ width: '40%' }} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[var(--color-outline-variant)] uppercase flex items-center gap-2"><Zap size={14} className="text-[var(--color-primary)]" /> VITALITY</span>
                  <span className="text-white">{hFields?.vit || 0}</span>
                </div>
                <div className="h-1 w-full bg-[var(--color-surface-container-highest)]">
                  <div className="h-full bg-[var(--color-primary)]" style={{ width: '80%' }} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-6 border-t border-[var(--color-outline-variant)]/20">
              <div className="text-[10px] font-mono text-[var(--color-primary-dim)] uppercase tracking-widest mb-4">Buff Synchrony</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[9px] font-mono border border-[var(--color-primary)]/20 uppercase tracking-widest">Weapon_Link: Active</span>
                <span className="px-2 py-1 bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] text-[9px] font-mono border border-[var(--color-tertiary)]/20 uppercase tracking-widest">Shadow_Echo: High</span>
              </div>
            </div>
          </DataPanel>

          <DataPanel variant="low" className="flex-1 border-r-2 border-[var(--color-error)]">
             <div className="text-[10px] font-mono text-[var(--color-error)] uppercase tracking-widest mb-2">Notice // Warning</div>
             <p className="font-mono text-[10px] text-[var(--color-outline-variant)] leading-relaxed">
               Modifying equipped soul-bound items while in a high-concurrency instance may result in state desynchronization. Ensure total mana stability before recalibrating primary weapon nodes.
             </p>
          </DataPanel>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
