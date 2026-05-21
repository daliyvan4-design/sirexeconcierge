"use client";

import { Search, Bell, ExternalLink, Menu } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  children?: React.ReactNode;
}

export function Topbar({ title, subtitle, onMenuToggle, children }: TopbarProps) {
  return (
    <div className="bg-white border-b border-line">
      <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle} className="lg:hidden text-ink">
            <Menu size={20} />
          </button>
          <div>
            <h2 className="font-serif text-[22px] text-ink leading-tight">{title}</h2>
            {subtitle && <p className="text-[12px] text-mute">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {children}
          <div className="hidden md:flex items-center gap-2 bg-cream border border-line rounded-full px-3 py-2">
            <Search size={14} className="text-mute" />
            <input
              className="bg-transparent text-[13px] w-56 outline-none"
              placeholder="Rechercher voyageur, réf, hôtel…"
            />
            <span className="mono text-[10px] text-mute border border-line rounded px-1">⌘K</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-cream border border-line hover:bg-cream2 flex items-center justify-center relative">
            <Bell size={16} className="text-ink" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-err" />
          </button>
          <Link
            href="/fr"
            className="hidden sm:flex text-[12px] text-mute hover:text-ink items-center gap-1"
          >
            <ExternalLink size={12} /> Vue voyageur
          </Link>
        </div>
      </div>
    </div>
  );
}
