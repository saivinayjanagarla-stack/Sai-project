import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  LogOut, 
  Sparkles, 
  Search, 
  Bell, 
  Sun, 
  ChevronDown, 
  Building2, 
  ShieldCheck, 
  Check,
  User,
  Sliders,
  HelpCircle
} from 'lucide-react';

export default function Navbar({ onOpenNotifications }) {
  const { user, logout } = useAuth();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('GreenCorp HQ');

  const workspaces = [
    { name: 'GreenCorp HQ', desc: 'Scope 1-3 Enterprise Admin' },
    { name: 'Campus East Facilities', desc: 'IoT Metering Hub' },
    { name: 'EMEA Logistics Network', desc: 'Scope 3 Supply Chain' },
    { name: 'APAC Manufacturing', desc: 'Solar PV & Storage' },
  ];

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-subtle">
      {/* Brand & Workspace Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="font-black text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
              EcoMetrics <span className="eco-gradient-text font-black">AI</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Net-Zero & ESG Platform
            </p>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="relative hidden md:block pl-4 border-l border-slate-200">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{selectedWorkspace}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {workspaceOpen && (
            <div className="absolute top-full left-4 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Workspace
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.name}
                  onClick={() => {
                    setSelectedWorkspace(ws.name);
                    setWorkspaceOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-800">{ws.name}</div>
                    <div className="text-[10px] text-slate-400">{ws.desc}</div>
                  </div>
                  {selectedWorkspace === ws.name && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search emissions data, facility meters, ESG reports, or ask AI..."
            className="w-full pl-9 pr-12 py-2 rounded-2xl bg-slate-100/70 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Live AI Status Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gemini AI Connected</span>
        </div>

        {/* Theme Switcher */}
        <button
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-colors"
          title="Theme (Light Glass active)"
        >
          <Sun className="w-4 h-4 text-amber-500" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </button>

        {/* User Profile Dropdown */}
        {user && (
          <div className="relative pl-2 border-l border-slate-200">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2.5 p-1 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-emerald-500/20">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden xl:block text-left pr-1">
                <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                <div className="text-[10px] font-medium text-emerald-600">{user.role || 'Sustainability Lead'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-500">{user.email || 'user@ecometrics.ai'}</div>
                  <div className="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{user.role || 'Enterprise Admin'}</span>
                  </div>
                </div>

                <button className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 font-medium hover:bg-slate-100 flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account Settings</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 font-medium hover:bg-slate-100 flex items-center space-x-2">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span>API & Integrations</span>
                </button>
                <button className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 font-medium hover:bg-slate-100 flex items-center space-x-2">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>GHG Protocol Docs</span>
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 font-bold hover:bg-rose-50 flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
