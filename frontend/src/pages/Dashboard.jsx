import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Flame, Zap, Droplets, Recycle, AlertTriangle, Sparkles, Plus, TrendingDown, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import EmissionModal from '../components/EmissionModal';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/emissions/summary');
      setSummary(res.data.summary);
      setMonthlyTrend(res.data.monthlyTrend || []);
      setCategoryBreakdown(res.data.categoryBreakdown || []);
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ['#22c55e', '#3b82f6', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-eco-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Loading Sustainability Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-eco-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> GreenCorp Campus Portfolio
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Sustainability & Decarbonization Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time Scope 1-3 GHG metrics, IoT energy monitoring, and AI optimization recommendations.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-eco-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Log Meter Data</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total CO2e */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Total GHG Emissions</span>
            <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1.5 flex-wrap min-w-0">
            <span className="text-2xl xl:text-3xl font-black text-white tracking-tight truncate max-w-full" title={summary?.total_co2e_tonnes}>
              {summary?.total_co2e_tonnes}
            </span>
            <span className="text-xs font-medium text-slate-400 shrink-0">t CO2e / mo</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-eco-400 font-semibold space-x-1">
            <TrendingDown className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">-14.2% vs previous quarter</span>
          </div>
        </div>

        {/* Card 2: Energy Consumption */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Electricity Usage</span>
            <div className="p-2 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-500/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1.5 flex-wrap min-w-0">
            <span className="text-2xl xl:text-3xl font-black text-white tracking-tight truncate max-w-full" title={summary?.total_energy_kwh?.toLocaleString()}>
              {summary?.total_energy_kwh?.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400 shrink-0">kWh</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 truncate">
            <span className="text-eco-400 font-semibold">{summary?.renewable_pct}%</span> Renewable Share (Solar PV)
          </div>
        </div>

        {/* Card 3: Water Intensity */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Water Intensity</span>
            <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1.5 flex-wrap min-w-0">
            <span className="text-2xl xl:text-3xl font-black text-white tracking-tight truncate max-w-full" title={summary?.total_water_liters?.toLocaleString()}>
              {summary?.total_water_liters?.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400 shrink-0">Liters</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 truncate">
            <span className="text-cyan-400 font-semibold">68%</span> Greywater Recycled
          </div>
        </div>

        {/* Card 4: ESG Score */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">ESG Compliance Score</span>
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-500/30 shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-1.5 flex-wrap min-w-0">
            <span className="text-2xl xl:text-3xl font-black text-white tracking-tight truncate max-w-full">
              {summary?.esg_compliance_score}
            </span>
            <span className="text-xs font-medium text-slate-400 shrink-0">/ 100</span>
          </div>
          <div className="mt-3 text-xs text-amber-400 font-semibold flex items-center gap-1 truncate">
            <span>GHG Protocol Tier A Rating</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly GHG Emissions Trend */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Monthly GHG Emissions Trajectory</h3>
              <p className="text-xs text-slate-400">Scope 1 Direct, Scope 2 Electricity & Scope 3 Value Chain (Metric Tonnes CO2e)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300">GHG Protocol</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scope1Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="scope2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="scope3Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="scope1_tonnes" name="Scope 1 (Gas)" stroke="#ef4444" fillOpacity={1} fill="url(#scope1Grad)" />
                <Area type="monotone" dataKey="scope2_tonnes" name="Scope 2 (Electricity)" stroke="#3b82f6" fillOpacity={1} fill="url(#scope2Grad)" />
                <Area type="monotone" dataKey="scope3_tonnes" name="Scope 3 (Value Chain)" stroke="#22c55e" fillOpacity={1} fill="url(#scope3Grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div>
            <h3 className="font-bold text-base text-white">Carbon Footprint Distribution</h3>
            <p className="text-xs text-slate-400">Emissions share by resource category</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="total_tonnes"
                  nameKey="category"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Anomaly Detection & Insights Feed */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-eco-400 animate-pulse" />
            <h3 className="font-bold text-base text-white">AI-Detected Operational Anomalies & Efficiency Recommendations</h3>
          </div>
          <span className="text-xs font-medium text-slate-400">Real-time IoT Monitor</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alert.severity === 'High' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                    alert.severity === 'Medium' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {alert.severity} Severity
                  </span>
                  <h4 className="font-semibold text-sm text-slate-200">{alert.title}</h4>
                  <span className="text-xs text-slate-500">• {alert.detected_at}</span>
                </div>
                <p className="text-xs text-slate-400">{alert.description}</p>
                <div className="p-2.5 rounded-lg bg-eco-950/40 border border-eco-500/20 text-xs text-eco-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-eco-400 mt-0.5" />
                  <span><strong>Gemini AI Recommendation:</strong> {alert.ai_recommendation}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  alert.status === 'Resolved' ? 'bg-slate-800 text-slate-400' : 'bg-eco-500/20 text-eco-400 border border-eco-500/30'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchDashboardData}
      />
    </div>
  );
}
