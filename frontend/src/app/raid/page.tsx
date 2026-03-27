/* eslint-disable */
// @ts-nocheck
"use client"

import { DataPanel } from "@/components/ui/DataPanel"
import { HUDButton } from "@/components/ui/HUDButton"
import { Crosshair, ShieldAlert, Skull, Activity } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClientQuery, useSuiClient } from '@mysten/dapp-kit';

const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID;
const BOSS_ID = process.env.NEXT_PUBLIC_BOSS_ID;

export default function RaidRoom() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [combatLog, setCombatLog] = useState<string>("Awaiting input...");
  const [isDefeated, setIsDefeated] = useState<boolean>(false);

  // 1. Fetch the Shared Boss Object State
  const { data: bossData, refetch: refetchBoss } = useSuiClientQuery('getObject', {
    id: BOSS_ID as string,
    options: { showContent: true }
  }, { enabled: !!BOSS_ID, refetchInterval: 3000 });

  // 2. Fetch the Player's Hunter Object
  const { data: ownedObjects } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address as string,
    filter: { StructType: `${PACKAGE_ID}::hunter::Hunter` },
    options: { showContent: true }
  }, { enabled: !!account });

  const hunter = ownedObjects?.data[0]?.data;
  const hContent = hunter?.content as any;
  const bContent = bossData?.data?.content as any;

  const currentHp = bContent?.fields?.current_hp ? Number(bContent.fields.current_hp) : 10;
  const maxHp = bContent?.fields?.max_hp ? Number(bContent.fields.max_hp) : 10;

  // 3. Victory Polling Logic
  useEffect(() => {
    if (bContent && currentHp === 0) {
      setIsDefeated(true);
    }
  }, [currentHp, bContent]);

  const executePhantomStrike = () => {
    if (!account || !hunter) return setCombatLog("ERROR: Hunter/Wallet Not Found");
    
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::raid::phantom_strike`,
      arguments: [
        tx.object(BOSS_ID),
        tx.object(hunter.objectId),
      ],
    });

    setTxLog("Executing [PHANTOM STRIKE]...");
    signAndExecute({ transaction: tx }, {
      onSuccess: () => {
        setTxLog("Success: Boss Damaged!");
        refetchBoss();
      },
      onError: (e) => setTxLog(`Failure: ${e.message}`)
    });
  };

  const setTxLog = (msg: string) => setCombatLog(msg);

  return (
    <main className="min-h-screen bg-[var(--color-background)] p-4 md:p-8 flex flex-col gap-8 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(var(--color-error) 1px, transparent 1px), linear-gradient(90deg, var(--color-error) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header / Combat Status */}
      <header className="flex justify-between items-start z-10 w-full border-b border-[var(--color-error)]/30 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-[var(--color-error)] flex items-center gap-3">
            <Skull size={28} /> DANGER // INSTANCE ANOMALY
          </h1>
          <p className="font-mono text-xs text-[var(--color-error)]/70 uppercase tracking-widest mt-1">Shared Object: {BOSS_ID} | Mode: Guild Raid</p>
        </div>
        <div className="hidden md:flex gap-4">
          <HUDButton variant="ghost">Extract Shadow</HUDButton>
          <HUDButton variant="ghost">Flee Instance</HUDButton>
        </div>
      </header>

      {/* Main Grid: Boss & Target Data */}
      <div className="flex flex-col gap-6 z-10 flex-1">
        
        {/* Boss Health UI */}
        <section className="w-full max-w-4xl mx-auto flex flex-col gap-2 mt-4">
          <div className="flex justify-between items-end">
             <div>
               <h2 className="text-4xl font-display uppercase tracking-widest text-white shadow-[0_0_10px_var(--color-error)]">The Architect</h2>
               <span className="text-sm font-mono text-[var(--color-error)] uppercase tracking-widest">Floor 100 Boss // Supreme Grade</span>
             </div>
              <p className="font-mono text-xl text-[var(--color-error)] animate-pulse">HP: {currentHp.toLocaleString()} / {maxHp.toLocaleString()}</p>
          </div>
          <div className="w-full bg-[var(--color-surface-container-highest)] h-4 border border-[var(--color-error)]/50">
             <motion.div 
               animate={{ width: `${(currentHp / maxHp) * 100}%` }}
               transition={{ type: "spring", stiffness: 50 }}
               className="bg-[var(--color-error)] h-full shadow-[0_0_15px_var(--color-error)]" 
             />
          </div>
        </section>

        {/* Combat Tracking & Active Party */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
           
           <DataPanel variant="low" className="md:col-span-4 border-l-2 border-[var(--color-secondary)]">
              <h3 className="font-display text-sm uppercase tracking-widest text-[var(--color-secondary)] mb-4 flex items-center gap-2">
                <Activity size={16}/> Live Party State
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Jin-Woo", class: "Assassin", hp: "100%", status: "OK", color: "text-[var(--color-primary)]"},
                  { name: "Cha Hae-In", class: "Sword", hp: "45%", status: "BLEED", color: "text-[var(--color-error)]"},
                ].map((member, i) => (
                  <div key={i} className="flex flex-col gap-1 border-b border-[var(--color-outline-variant)]/30 pb-2">
                    <div className="flex justify-between font-mono text-sm">
                      <span className="uppercase text-[var(--color-foreground)]">{member.name} // {member.class}</span>
                      <span className={member.color}>{member.hp} HP</span>
                    </div>
                    <div className="w-full bg-[var(--color-surface-container)] h-1">
                      <div className={`h-full ${member.hp === '100%' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-error)]'}`} style={{width: member.hp}} />
                    </div>
                  </div>
                ))}
              </div>
           </DataPanel>

           <DataPanel variant="base" glowing className="md:col-span-8 flex flex-col items-center justify-center min-h-[300px] border border-[var(--color-error)]/20 shadow-[0_0_150px_var(--color-error)]/10">
              <div className="absolute top-4 left-4 text-[var(--color-outline-variant)] font-mono text-xs">TARGET_LOCK: ENABLED</div>
              <div className="absolute top-4 right-4 text-[var(--color-secondary)] font-mono text-xs">{combatLog}</div>

              <div className="relative">
                 <Crosshair size={120} className="text-[var(--color-error)] opacity-20 animate-spin-slow" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldAlert size={48} className="text-[var(--color-error)]" />
                 </div>
              </div>
           </DataPanel>
        </div>

      </div>

      {/* Action Bar / Skills */}
      <footer className="w-full border-t border-[var(--color-outline-variant)]/30 pt-6 mt-auto z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="font-mono text-[var(--color-primary-dim)] text-xs uppercase flex flex-col gap-1">
           <span>Mana Reserve: 450/450</span>
           <span>Cooldowns: Idle</span>
         </div>
         <div className="flex gap-4">
            <HUDButton variant="ghost" className="px-8 border border-[var(--color-primary-dim)]/50">Basic Attack</HUDButton>
            <HUDButton variant="primary" className="px-12 ml-4 relative" onClick={executePhantomStrike}>
              <span className="absolute -top-3 left-2 text-[10px] font-mono text-[var(--color-primary-dim)] bg-[var(--color-surface)] px-1">SIGNATURE</span>
              Phantom Strike [15MP]
            </HUDButton>
         </div>
      </footer>

      {/* Extreme Defeat Overlay */}
      <AnimatePresence>
        {isDefeated && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 pointer-events-none"
          >
             <div className="text-center">
                 <motion.h1 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-7xl font-display font-bold text-[var(--color-error)] uppercase tracking-[0.2em] shadow-[0_0_50px_var(--color-error)]"
                  >
                    BOSS DEFEATED
                 </motion.h1>
                 <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="font-mono text-[var(--color-tertiary)] text-xl tracking-widest mt-8 animate-pulse"
                 >
                    [SYSTEM_CALL]: INITIATING SHADOW EXTRACTION PROTOCOL...
                 </motion.p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  )
}
