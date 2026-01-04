"use client";

import { useState } from "react";
import { SearchIcon, BellIcon, SettingsIcon, MenuIcon } from "@/components/icons/dashboard-icons";

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export function DashboardHeader({ onToggleSidebar, onOpenSettings }: DashboardHeaderProps) {
  const [notifications] = useState(2);

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors lg:hidden"
          >
            <MenuIcon size={20} />
          </button>
          <h1 className="text-2xl font-semibold text-slate-900">Trading Dashboard</h1>
          <div className="hidden sm:flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live
            </span>
            <span className="text-sm text-slate-500">Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search symbols..."
                className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-slate-400" size={16} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg transition-colors">
            <BellIcon size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {notifications}
              </span>
            )}
          </button>

          {/* Settings */}
          <button 
            onClick={onOpenSettings}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg transition-colors"
          >
            <SettingsIcon size={20} />
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center border border-slate-300">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}