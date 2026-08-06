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
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

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
      className={`fixed left-4 top-20 z-30 hidden md:flex flex-col justify-between p-3 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-glass transition-all duration-300 ease-in-out h-[calc(100vh-6rem)] ${
        isHovered ? 'w-64 shadow-2xl ring-1 ring-emerald-500/10' : 'w-16'
      }`}
    >
      {/* Top Section */}
      <div className="space-y-4">
        {/* Header Title when Expanded */}
        <div className={`px-2 py-1 transition-opacity duration-200 flex items-center justify-between ${
          isHovered ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Navigation Menu
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            Pro
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center space-x-3 px-3 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50/70 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Highlight Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                    )}

                    <div className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-800'}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Label & Tag when Expanded */}
                    <div className={`flex-1 flex items-center justify-between transition-all duration-200 overflow-hidden ${
                      isHovered ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                    }`}>
                      <span className="whitespace-nowrap font-bold">{item.label}</span>
                      {item.tag && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${
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
        isHovered ? 'opacity-100 max-h-48 mt-4' : 'opacity-0 max-h-0'
      }`}>
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-200/60 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>GHG Protocol Compliant</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            ISO 14064-1 & Corporate Standard certified engine active.
          </p>
        </div>
      </div>
    </aside>
  );
}
