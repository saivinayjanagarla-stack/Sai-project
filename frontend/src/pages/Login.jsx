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
    <div className="min-h-screen bg-[#F7F9FC] text-[#111827] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            EcoMetrics <span className="eco-gradient-text">AI</span>
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Enterprise Decarbonization Platform</p>
        </div>

        {/* Login Card */}
        <div className="glass-card-light p-8 rounded-3xl border border-slate-200/90 space-y-6 shadow-2xl">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-extrabold text-slate-900">Sign In to Dashboard</h2>
            <p className="text-xs text-slate-500">Access real-time Scope 1-3 GHG metrics & AI recommendations</p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecometrics.ai"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md shadow-emerald-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          {/* Quick Demo Credential Autofill */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
              1-Click Demo Evaluation Autofill
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-2 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-emerald-700 text-center transition-colors shadow-2xs"
              >
                Demo Officer
              </button>
              <button
                type="button"
                onClick={fillDemoAuditor}
                className="py-2 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-blue-700 text-center transition-colors shadow-2xs"
              >
                Demo Auditor
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 font-medium">
          Need an account? <Link to="/register" className="text-emerald-600 font-extrabold hover:underline">Register New Organization</Link>
        </div>
      </div>
    </div>
  );
}
