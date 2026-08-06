import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@ecometrics.ai');
    setPassword('password123');
  };

  const fillDemoAuditor = () => {
    setEmail('alex@greencorp.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-eco-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl eco-gradient-bg mx-auto flex items-center justify-center shadow-xl shadow-eco-500/30">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            EcoMetrics <span className="eco-gradient-text">AI</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise Decarbonization & Resource Intelligence</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-white">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-400">Access real-time Scope 1-3 GHG metrics & AI advice</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecometrics.ai"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-eco-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-eco-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-eco-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credential Autofill */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
              1-Click Demo Evaluation Autofill
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-eco-400 text-center transition-colors"
              >
                Demo Officer
              </button>
              <button
                type="button"
                onClick={fillDemoAuditor}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-cyan-400 text-center transition-colors"
              >
                Demo Auditor
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Need an account? <Link to="/register" className="text-eco-400 font-bold hover:underline">Register New Organization</Link>
        </div>
      </div>
    </div>
  );
}
