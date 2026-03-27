/* eslint-disable */
// @ts-nocheck
"use client"

import { useState, useEffect } from "react"

import { DataPanel } from "@/components/ui/DataPanel"
import { HUDButton } from "@/components/ui/HUDButton"
import { RankIndicator } from "@/components/ui/RankIndicator"
import { Battery, Crosshair, Shield, Zap } from "lucide-react"
import { ConnectButton, useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { motion, AnimatePresence } from "framer-motion"
import { Transaction } from "@mysten/sui/transactions"
import { useRouter } from "next/navigation"
import Image from "next/image"
import IgrisImage from "@/img/igris.png"

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID;

export default function Dashboard() {
  const account = useCurrentAccount();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [level, setLevel] = useState(1);
  const router = useRouter();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [txLog, setTxLog] = useState<string>("System Idle...");
  
  // Natively poll the OneChain RPC for the logged-in user's Hunter object
  const { data: ownedObjects, refetch: refetchHunter } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address as string,
    filter: { StructType: `${PACKAGE_ID}::hunter::Hunter` },
    options: { showContent: true }
  }, { enabled: !!account });

  const hunter = ownedObjects?.data[0]?.data;
  const hunterData = hunter?.content as any;
  const hFields = hunterData?.fields;
  const isConnected = !!account;
  const hasHunter = !!hunterData;

  const { data: weaponField, refetch: refetchWeapon } = useSuiClientQuery('getDynamicFieldObject', {
    parentId: hunter?.objectId as string,
    name: { type: 'vector<u8>', value: Array.from(new TextEncoder().encode("active_weapon")) }
  }, { enabled: !!hunter?.objectId });

  const weaponContent = (weaponField?.data?.content as any)?.fields;
  const weaponName = weaponContent?.name;
  const weaponStr = weaponContent?.str_bonus;

  // Sync state if hunterData changes
  useEffect(() => {
    if (hFields?.level) setLevel(Number(hFields.level));
  }, [hFields]);

  const handleAwaken = () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::hunter::awaken`,
      arguments: [tx.pure.string("Sung Jin-Woo"), tx.pure.u8(0)],
    });
    setTxLog("Broadcasting Awakening Protocol...");
    signAndExecute({ transaction: tx }, {
      onSuccess: () => {
        setTxLog("Identity Secured. System Initialized.");
        refetchHunter();
        refetchWeapon();
      },
      onError: (e) => setTxLog(`Error: ${e.message}`)
    });
  };

  return (
    <div className="flex flex-col gap-8 p-8 flex-1 transition-opacity duration-1000">
      
      {/* Dashboard Summary Header */}
      <section className="flex justify-between items-end border-b border-[var(--color-outline-variant)]/20 pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold uppercase tracking-[0.2em] text-white">System Overview</h1>
          <p className="font-mono text-[10px] text-[var(--color-primary-dim)] uppercase tracking-[0.3em] mt-2">Identity Sync: Stable // Region: OneChain_Main_Node</p>
        </div>
        <div className="flex gap-4">
          <ConnectButton className="!bg-[var(--color-primary)] !text-[var(--color-background)] !rounded-none !font-display !font-bold !uppercase !tracking-widest !h-10 !px-6" />
        </div>
      </section>

      {/* Main Asymmetrical Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 flex-1 ${!isConnected ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Left Column: Hunter Identity (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <DataPanel variant="low" glowing className="flex flex-col gap-6">
            <div className="flex justify-between items-start border-b border-[var(--color-outline-variant)]/30 pb-4">
              <div>
                <h2 className="text-xl font-display uppercase tracking-widest text-white">
                  {hunterData?.fields?.name || "Sung Jin-Woo"}
                </h2>
                <span className="text-sm font-mono text-[var(--color-outline-variant)]">LEVEL {level} // CLASS: {hunterData ? (hunterData.fields.class_type === 0 ? "ASSASSIN" : "UNKNOWN") : "NONE"}</span>
              </div>
              <RankIndicator rank="E" />
            </div>

            <div className="flex flex-col gap-3 font-mono text-sm">
              <div className="flex justify-between items-center text-[10px] tracking-tighter">
                <span className="text-[var(--color-on-surface-variant)] uppercase">Experience Buffer</span>
                <span className="text-[var(--color-primary)]">{hFields?.xp || 0} / {(level || 1) * 100}</span>
              </div>
              <div className="w-full bg-[var(--color-surface-container-highest)] h-1">
                <motion.div 
                  initial={{ width: "0%" }} 
                  animate={{ width: `${Math.min(100, (Number(hFields?.xp || 0) / ((level || 1) * 100)) * 100)}%` }} 
                  className="bg-[var(--color-primary)] h-full shadow-[0_0_8px_var(--color-primary)]" 
                />
              </div>
            </div>

            {/* Core Stats Map to On-Chain Data */}
            <div className="space-y-4 pt-4 border-t border-[var(--color-outline-variant)]/30">
              <h3 className="font-display text-[10px] uppercase tracking-widest text-[var(--color-primary-dim)]">Vitals Tracking</h3>
              <div className="flex justify-between items-center text-white">
                <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-outline-variant)] uppercase"><Crosshair size={14} className="text-[var(--color-error)]" /> STR</span>
                <span className="font-mono">{hFields?.str || 0}</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-outline-variant)] uppercase"><Battery size={14} className="text-[var(--color-secondary)]" /> INT</span>
                <span className="font-mono">{hFields?.int || 0}</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-outline-variant)] uppercase"><Shield size={14} className="text-[var(--color-primary)]" /> VIT</span>
                <span className="font-mono">{hFields?.vit || 0}</span>
              </div>
            </div>
          </DataPanel>
          
          <DataPanel variant="base" className="flex-1 border-l-2 border-[var(--color-primary)]">
            <h3 className="font-display text-xs uppercase tracking-widest text-[var(--color-primary-dim)] mb-4 tracking-tighter">Action Pipeline</h3>
            <div className="flex flex-col gap-3">
              {!hasHunter ? (
                <HUDButton variant="glitch" className="w-full justify-start" onClick={handleAwaken}>Awaken Level 1 Hunter</HUDButton>
              ) : (
                <>
                  <HUDButton variant="primary" className="w-full justify-start" onClick={() => router.push('/raid')}>Enter Raid Instance</HUDButton>
                  <HUDButton variant="ghost" className="w-full justify-start text-xs" onClick={() => router.push('/guild')}>Navigate to Guild Hall</HUDButton>
                </>
              )}
            </div>
          </DataPanel>
        </section>

        {/* Right Column: Inventory & Extracted Shadows (8 cols) */}
        <section className="md:col-span-8 flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Weapon Wrapper */}
            <DataPanel variant="high" className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-[var(--color-surface-container)]/50">
               <div className="absolute top-2 right-2 text-[var(--color-primary-dim)] font-mono text-[10px]">SLOT.01 [WEAPON]</div>
               <div className={`w-16 h-16 mb-4 flex items-center justify-center border ${weaponName ? 'border-[var(--color-primary)] text-[var(--color-primary)] shadow-[0_0_20px_var(--color-primary)]' : 'border-[var(--color-secondary)] text-[var(--color-secondary)] shadow-[0_0_10px_var(--color-secondary)]/20'} rotate-45`}>
                 <div className="-rotate-45"><Crosshair /></div>
               </div>
               <h3 className="font-display uppercase tracking-widest text-lg text-[var(--color-foreground)]">
                 {weaponName ? `FANG OF ${weaponName}` : "UNARMED"}
               </h3>
               <p className="text-sm font-mono text-[var(--color-on-surface-variant)] mt-2 uppercase tracking-widest">
                 {weaponStr ? `+${weaponStr} STR | ON-CHAIN` : "DEFEAT BOSS TO CLAIM"}
               </p>
               <div className="mt-4 flex gap-2 w-full max-w-[200px] justify-between text-xs font-mono">
                 <span className={weaponName ? "text-green-400" : "text-gray-500"}>SYNC: {weaponName ? "100%" : "0%"}</span>
                 <span className="text-[var(--color-primary)]">{weaponName ? "LEGENDARY" : "LOCKED"}</span>
               </div>
            </DataPanel>

            {/* Extracted Shadow Wrapper */}
            <DataPanel variant="base" glowing className="min-h-[200px] flex flex-col items-center justify-center p-8 border-r-2 border-[var(--color-tertiary)] overflow-hidden">
               <div className="absolute top-2 right-2 text-[var(--color-outline-variant)] font-mono text-[10px] z-10">SLOT.02 [SHADOW]</div>
               <div className="relative w-24 h-24 mb-4 flex items-center justify-center border border-[var(--color-tertiary)] shadow-[0_0_15px_var(--color-tertiary)]">
                 <Image 
                   src={IgrisImage} 
                   alt="Igris" 
                   fill 
                   className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] to-transparent pointer-events-none" />
               </div>
               <h3 className="font-display uppercase tracking-widest text-lg text-[var(--color-tertiary)]">Igris (Blood-Red)</h3>
               <p className="text-sm font-mono text-[var(--color-on-surface-variant)] mt-2 uppercase tracking-widest">Elite Knight Grade | Max Lv</p>
               <HUDButton variant="glitch" className="mt-4 w-full max-w-[200px] text-xs py-1">ARISE</HUDButton>
            </DataPanel>
          </div>

          {/* System Log / Tactical List */}
          <DataPanel variant="low" className="flex-1">
            <h3 className="font-display text-sm uppercase tracking-widest text-[var(--color-primary-dim)] mb-4">System Log [Combat & Transaction Events]</h3>
            <div className="space-y-2">
              {[].map((log, i) => (
                <div key={i} className={`flex items-start gap-4 p-2 text-sm font-mono border-l-2 border-[var(--color-outline-variant)]/30 ${i % 2 === 0 ? 'bg-[var(--color-surface-container)]' : ''}`}>
                </div>
              ))}
              {/* Dummy data for visual presentation */}
              <div className="flex items-start gap-4 p-2 text-sm font-mono border-l-2 border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container)]"><span className="text-[var(--color-outline-variant)]">[LIVE]</span><span className="text-[var(--color-primary)]">[SYSTEM]</span><span className="text-[var(--color-foreground)]">{txLog}</span></div>
              <div className="flex items-start gap-4 p-2 text-sm font-mono border-l-2 border-[var(--color-outline-variant)]/30"><span className="text-[var(--color-outline-variant)]">[14:02:44]</span><span className="text-[var(--color-tertiary)]">[INFO]</span><span className="text-[var(--color-foreground)]">Tx Confirmed: Shadow Extraction [Success]</span></div>
              <div className="flex items-start gap-4 p-2 text-sm font-mono border-l-2 border-[var(--color-outline-variant)]/30"><span className="text-[var(--color-outline-variant)]">[14:00:12]</span><span className="text-[var(--color-secondary)]">[CRITICAL]</span><span className="text-[var(--color-foreground)]">Boss Defeated: Architect [Floor 100]</span></div>
            </div>
          </DataPanel>
          
        </section>
      </div>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 text-center">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 className="w-32 h-32 border-4 border-[var(--color-primary)] rounded-full border-t-transparent flex items-center justify-center shadow-[0_0_50px_var(--color-primary)]"
               />
               <h1 className="text-6xl font-display font-bold text-white tracking-[0.2em] uppercase shadow-[0_0_30px_var(--color-primary)] drop-shadow-2xl mt-8">LEVEL UP!</h1>
               <p className="font-mono text-[var(--color-primary)] text-xl tracking-widest">YOU HAVE REACHED LEVEL 100.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
