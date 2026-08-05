import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogOut, User, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl eco-gradient-bg flex items-center justify-center shadow-lg shadow-eco-500/20">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
            EcoMetrics <span className="eco-gradient-text">AI</span>
          </span>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Decarbonization & Resource Intelligence
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Gemini Engine Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>Gemini AI Engine Connected</span>
        </div>

        {user && (
          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-eco-400 font-bold text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-200">{user.name}</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-eco-500" /> {user.role}
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
