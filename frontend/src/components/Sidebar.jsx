import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Flame, Bot, Sliders, FileText, Trophy, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { path: '/emissions', label: 'Emissions Tracker', icon: Flame },
    { path: '/ai-advisor', label: 'AI Advisor & Chat', icon: Bot },
    { path: '/simulator', label: 'Net-Zero Simulator', icon: Sliders },
    { path: '/reports', label: 'ESG Reports', icon: FileText },
    { path: '/community', label: 'Eco Community', icon: Trophy },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Navigation Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-eco-500/15 text-eco-400 border border-eco-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-eco-400 font-semibold">
          <HelpCircle className="w-4 h-4" />
          <span>GHG Standard</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Compliant with Scope 1, 2, and 3 accounting guidelines under the GHG Protocol Corporate Standard.
        </p>
      </div>
    </aside>
  );
}
