import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Flame, 
  Bot, 
  Sliders, 
  FileText, 
  Trophy, 
  Sparkles, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export default function Sidebar({ isPinned, onTogglePin }) {
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || isHovered;

  const navItems = [
    { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard, tag: 'Live' },
    { path: '/emissions', label: 'Emissions Tracker', icon: Flame, tag: 'Scope 1-3' },
    { path: '/ai-advisor', label: 'AI Sustainability Advisor', icon: Bot, tag: 'Gemini' },
    { path: '/simulator', label: 'Net-Zero Simulator', icon: Sliders, tag: 'AI Scenario' },
    { path: '/reports', label: 'ESG Reports & Disclosure', icon: FileText, tag: 'GRI/CSRD' },
    { path: '/community', label: 'Eco Leaderboard', icon: Trophy, tag: 'Rankings' },
    { path: '/settings', label: 'Settings', icon: HelpCircle, tag: 'Config' },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-4 top-20 z-30 hidden md:flex flex-col justify-between p-3 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl transition-all duration-300 ease-in-out h-[calc(100vh-6rem)] ${
        isExpanded ? 'w-72 shadow-2xl ring-1 ring-emerald-500/10' : 'w-16'
      }`}
    >
      {/* Top Navigation Section */}
      <div className="space-y-3">
        {/* Sidebar Header & Pin Toggle Button */}
        <div className={`px-2 py-1 flex items-center justify-between transition-opacity duration-200 ${
          isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Navigation
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-extrabold border border-emerald-200">
              Pro SaaS
            </span>
          </div>

          <button
            onClick={onTogglePin}
            className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
            title={isPinned ? 'Collapse Sidebar' : 'Pin Sidebar Open'}
          >
            {isPinned ? <PanelLeftClose className="w-4 h-4 text-emerald-600" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Link Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50/80 text-emerald-700 border border-emerald-200/90 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Green Highlight Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    )}

                    <div className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-800'}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Navigation Label & Badge Tag when Expanded */}
                    <div className={`flex-1 flex items-center justify-between transition-all duration-200 min-w-0 overflow-hidden ${
                      isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                    }`}>
                      <span className="truncate pr-2 font-bold text-slate-800 text-xs">{item.label}</span>
                      {item.tag && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold shrink-0 ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info Box when Expanded */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? 'opacity-100 max-h-40 mt-2' : 'opacity-0 max-h-0'
      }`}>
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-200/80 text-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-700 font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>GHG Protocol Compliant</span>
          </div>
          <p className="text-slate-600 text-[10px] leading-relaxed font-medium">
            ISO 14064-1 & Corporate Accounting Standard engine active.
          </p>
        </div>
      </div>
    </aside>
  );
}
