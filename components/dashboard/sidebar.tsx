"use client";

import { useState } from "react";
import Link from "next/link";
import { OverviewIcon, UniverseIcon, RegimeIcon, AIIcon, SettingsIcon, ChevronLeftIcon } from "@/components/icons/dashboard-icons";

const navigation = [
  { name: "Overview", href: "/dashboard/trading", icon: OverviewIcon, current: true },
  { name: "Universe", href: "#universe", icon: UniverseIcon, current: false },
  { name: "Regime", href: "#regime", icon: RegimeIcon, current: false },
  { name: "AI Analysis", href: "#ai", icon: AIIcon, current: false },
  { name: "Settings", href: "#settings", icon: SettingsIcon, current: false },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <div className={`bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out ${
      collapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col border-r border-slate-800 ${
      collapsed ? 'lg:w-16' : 'lg:w-64'
    } fixed lg:relative z-30 lg:z-auto ${
      collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#94a3b8" strokeWidth="2" fill="none"/>
                <path d="M8 12L12 8L16 12L20 8L24 12V20L20 24L16 20L12 24L8 20V12Z" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <circle cx="16" cy="16" r="2" fill="#94a3b8"/>
              </svg>
            </div>
            <span className="font-semibold text-slate-100">Tradelia</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-slate-800 transition-colors"
        >
          <ChevronLeftIcon 
            className={`text-slate-400 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                item.current
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <IconComponent size={18} />
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center border border-slate-600">
            <span className="text-xs font-medium text-slate-300">U</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">Local User</p>
              <p className="text-xs text-slate-400 truncate">Development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}