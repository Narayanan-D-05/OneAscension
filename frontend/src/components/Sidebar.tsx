"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  Sword, 
  ShoppingBag, 
  Shield,
  Zap,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { HUDButton } from "./ui/HUDButton"

const navItems = [
  { name: "SYSTEM OVERVIEW", href: "/", icon: LayoutDashboard },
  { name: "HUNTERS' GUILD", href: "/guild", icon: Users },
  { name: "RAID INSTANCE", href: "/raid", icon: Sword },
  { name: "SHADOW MARKET", href: "/market", icon: ShoppingBag },
  { name: "THE ARMORY", href: "/armory", icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 bg-[var(--color-surface-container)] border border-[var(--color-primary)] md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-[var(--color-outline-variant)]/20 transition-transform duration-300 md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo / System Branding */}
        <div className="p-8 border-b border-[var(--color-outline-variant)]/20">
          <div className="flex items-center gap-2 text-[var(--color-primary)] mb-1">
            <Zap size={24} fill="currentColor" />
            <span className="font-display font-bold tracking-[0.2em] text-xl">SYSTEM</span>
          </div>
          <div className="font-mono text-[10px] text-[var(--color-primary-dim)] uppercase tracking-widest opacity-50">
            Node // OneChain_Testnet
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 font-display text-xs tracking-widest transition-all group relative overflow-hidden",
                  isActive 
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10" 
                    : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-bright)]"
                )}
                onClick={() => setIsOpen(false)}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-primary)] shadow-[2px_0_10px_var(--color-primary)]" />
                )}
                
                <item.icon size={18} className={cn(
                  "transition-colors",
                  isActive ? "text-[var(--color-primary)]" : "group-hover:text-[var(--color-primary)]"
                )} />
                <span className="mt-0.5">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer / Utility */}
        <div className="p-6 border-t border-[var(--color-outline-variant)]/20">
          <div className="bg-[var(--color-surface-container-low)] p-4 border border-[var(--color-outline-variant)]/10">
            <div className="text-[10px] font-mono text-[var(--color-outline-variant)] uppercase mb-2">Sync Status</div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-green-500/80 uppercase">Blockchain Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
