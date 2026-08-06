import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from '../components/CountUp';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { 
  Flame, 
  Zap, 
  Droplets, 
  Award, 
  Sparkles, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  Bot, 
  FileText, 
  Sliders, 
  Download, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Target,
  ZapOff,
  Sun,
  AlertTriangle,
  BarChart3,
  Layers,
  ChevronRight,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import EmissionModal from '../components/EmissionModal';
import { getCombinedLogs, calculateMetricsFromLogs } from '../utils/emissionsStorage';

const BASE_LOGS = [
  { id: 1, date: '2026-03-01', category: 'Electricity', scope: 'Scope 2', quantity: 45000, unit: 'kWh', co2e_kg: 17325, notes: 'HVAC cooling tower load peak' },
  { id: 2, date: '2026-04-01', category: 'Electricity', scope: 'Scope 2', quantity: 42000, unit: 'kWh', co2e_kg: 16170, notes: 'Smart thermostat trial started' },
  { id: 3, date: '2026-05-01', category: 'Electricity', scope: 'Scope 2', quantity: 38500, unit: 'kWh', co2e_kg: 14822, notes: 'Rooftop solar panel Phase 1 active' },
  { id: 4, date: '2026-06-01', category: 'Electricity', scope: 'Scope 2', quantity: 35000, unit: 'kWh', co2e_kg: 13475, notes: 'LED lighting retrofit completed' },
  { id: 5, date: '2026-07-01', category: 'Electricity', scope: 'Scope 2', quantity: 33000, unit: 'kWh', co2e_kg: 12705, notes: 'HVAC AI setback optimization active' },
  { id: 6, date: '2026-03-01', category: 'Natural Gas', scope: 'Scope 1', quantity: 1800, unit: 'Therms', co2e_kg: 9540, notes: 'Winter boiler heating' },
  { id: 7, date: '2026-04-01', category: 'Natural Gas', scope: 'Scope 1', quantity: 1400, unit: 'Therms', co2e_kg: 7420, notes: 'Spring heating baseline' },
  { id: 8, date: '2026-05-01', category: 'Natural Gas', scope: 'Scope 1', quantity: 900, unit: 'Therms', co2e_kg: 4770, notes: 'Domestic hot water only' },
  { id: 9, date: '2026-06-01', category: 'Natural Gas', scope: 'Scope 1', quantity: 650, unit: 'Therms', co2e_kg: 3445, notes: 'Heat pump boiler hybrid system' },
  { id: 10, date: '2026-05-01', category: 'Water', scope: 'Scope 3', quantity: 240000, unit: 'Liters', co2e_kg: 288, notes: 'Irrigation & cooling tower' },
  { id: 11, date: '2026-06-01', category: 'Water', scope: 'Scope 3', quantity: 190000, unit: 'Liters', co2e_kg: 228, notes: 'Greywater recycling online' },
  { id: 12, date: '2026-06-15', category: 'Waste', scope: 'Scope 3', quantity: 4200, unit: 'Kg', co2e_kg: 2100, notes: 'General landfill waste stream' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState('area');

  const fetchDashboardData = async () => {
    let baseLogs = BASE_LOGS;
    try {
      const res = await api.get('/emissions/logs');
      if (res.data?.logs?.length) {
        baseLogs = res.data.logs;
      }
    } catch (err) {
      console.warn('Dashboard network request fallback:', err);
    }

    const allLogs = getCombinedLogs(baseLogs);
    const { summary: calcSummary, categoryBreakdown: calcCategories, monthlyTrend: calcTrend } = calculateMetricsFromLogs(allLogs);

    setSummary(calcSummary);
    setCategoryBreakdown(calcCategories);
    setMonthlyTrend(calcTrend);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ['#22C55E', '#3B82F6', '#06B6D4', '#F59E0B', '#8B5CF6', '#EC4899'];

  // AI Recommendation Cards Data
  const aiRecommendations = [
    {
      id: 1,
      title: 'Reduce HVAC Usage During Peak Tariff Hours',
      impact: 'High Impact',
      impactColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Pre-cool Building B between 05:00 AM - 07:00 AM and setback thermostat by +2.5°C during 02:00 PM - 05:00 PM peak energy pricing windows.',
      savings: '$4,250 / mo',
      co2Reduction: '-8.4 t CO2e',
      confidence: 96,
      icon: ZapOff,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 2,
      title: 'Switch Building B Base Load to Solar Microgrid',
      impact: 'Critical Net-Zero',
      impactColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Redirect rooftop solar array output to server cooling loop before exporting surplus energy to the regional utility grid.',
      savings: '$6,800 / mo',
      co2Reduction: '-14.2 t CO2e',
      confidence: 94,
      icon: Sun,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 3,
      title: 'Water Consumption Spike Anomaly Detected',
      impact: 'Anomaly Alert',
      impactColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description: 'East Wing cooling tower water consumption is 18% above the 30-day baseline average. Valve inspection recommended.',
      savings: '$1,120 / mo',
      co2Reduction: '-1.8 t CO2e',
      confidence: 91,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      id: 4,
      title: 'Predicted Monthly Emissions Decreasing by 12%',
      impact: 'Forecast Target',
      impactColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description: 'AI model projects total Scope 1 & 2 emissions to drop to 89.8 t CO2e next month following heat pump commissioning.',
      savings: '$5,400 / mo',
      co2Reduction: '-12.0 t CO2e',
      confidence: 98,
      icon: Sparkles,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  // Facility Heatmap Intensity Matrix Data
  const facilityHeatmap = [
    { facility: 'HQ Building A', scope1: 'Low', scope2: 'Medium', score: 92, trend: '-12%' },
    { facility: 'Research Lab B', scope1: 'High', scope2: 'High', score: 76, trend: '-4%' },
    { facility: 'Logistics Hub East', scope1: 'Low', scope2: 'Low', score: 95, trend: '-19%' },
    { facility: 'APAC Assembly Plant', scope1: 'Medium', scope2: 'High', score: 81, trend: '-8%' },
  ];

  // Recent Activity Timeline Data
  const recentActivities = [
    {
      id: 1,
      title: 'Smart Meter #402 Data Uploaded',
      time: '14 minutes ago',
      user: 'Automated BACnet IoT Sync',
      type: 'upload',
      icon: Plus,
      badgeBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 2,
      title: 'Q2 ESG Disclosure Report Generated',
      time: '2 hours ago',
      user: 'Sarah Jenkins (Chief Sustainability Officer)',
      type: 'report',
      icon: FileText,
      badgeBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 3,
      title: 'Scope 2 Grid Reduction Verified (-14.2%)',
      time: '5 hours ago',
      user: 'Gemini AI Telemetry Auditor',
      type: 'reduction',
      icon: CheckCircle2,
      badgeBg: 'bg-teal-50 text-teal-600',
    },
    {
      id: 4,
      title: 'Net-Zero 2030 Heat Pump Simulation Completed',
      time: 'Yesterday at 4:30 PM',
      user: 'Alex Rivera (Facilities Lead)',
      type: 'simulation',
      icon: Sliders,
      badgeBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 🌍 Hero Section Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900 text-white p-6 md:p-8 shadow-2xl border border-emerald-500/20">
        {/* Decorative Animated Glow Orbs */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute left-1/3 -top-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>EcoMetrics AI Autonomous Engine v3.4</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 text-xs font-medium border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>GHG Scope 1-3 Verified</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Enterprise Decarbonization & Net-Zero SaaS
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              Real-time carbon accounting, IoT energy telemetry, predictive emissions modeling, and AI-driven sustainability advisory for Fortune 500 facilities.
            </p>

            {/* Carbon Net-Zero Goal Progress Bar */}
            <div className="pt-2 max-w-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  2030 Corporate Net-Zero Goal Progress
                </span>
                <span className="font-extrabold text-white">64.8% Achieved</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800/90 border border-slate-700 p-0.5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000 w-[64.8%]" />
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Upload Meter Telemetry</span>
              </button>
              <button
                onClick={() => navigate('/ai-advisor')}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
              >
                <Bot className="w-4 h-4 text-emerald-300" />
                <span>Ask AI Advisor</span>
              </button>
              <button
                onClick={() => navigate('/simulator')}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
              >
                <Sliders className="w-4 h-4 text-cyan-300" />
                <span>Run Net-Zero Simulation</span>
              </button>
            </div>
          </div>

          {/* Right Sustainability Score Card Gauge */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-xs p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-center space-y-3 shadow-2xl">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                🌍 Global Sustainability Score
              </span>
              
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                {/* SVG Gauge Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 transition-all duration-1000 ease-out"
                    strokeDasharray="88, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-white tracking-tight">88</span>
                  <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider">Rating A+</span>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-black/20 border border-white/10 text-xs text-slate-200">
                <span className="font-bold text-emerald-300">Latest Recommendation:</span>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                  HVAC setbacks can save 8.4 t CO2e this month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total CO2e */}
        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total GHG Emissions
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {summary?.total_co2e_tonnes || 102.29}
              </span>
              <span className="text-xs font-bold text-slate-500">t CO2e / mo</span>
            </div>
          </div>

          {/* Mini Sparkline Simulation */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0 20 Q 20 15, 40 18 T 80 8 T 100 5"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1 text-emerald-600 font-bold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-14.2% vs prev quarter</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Scope 1, 2 & 3</span>
          </div>
        </div>

        {/* Card 2: Electricity Usage */}
        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Electricity Usage
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {(summary?.total_energy_kwh || 193500).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">kWh</span>
            </div>
          </div>

          {/* Mini Sparkline Simulation */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0 12 Q 25 22, 50 10 T 80 15 T 100 6"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1 text-blue-600 font-bold">
              <Sun className="w-3.5 h-3.5" />
              <span>{summary?.renewable_pct || 38.5}% Solar Share</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">IoT Telemetry</span>
          </div>
        </div>

        {/* Card 3: Water Usage */}
        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Water Intensity
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 shadow-sm">
              <Droplets className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {(summary?.total_water_liters || 430000).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">Liters</span>
            </div>
          </div>

          {/* Mini Sparkline Simulation */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0 18 Q 30 5, 60 15 T 100 8"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1 text-cyan-600 font-bold">
              <span>68% Greywater Recycled</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Cooling & Restrooms</span>
          </div>
        </div>

        {/* Card 4: ESG Compliance Score */}
        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ESG Compliance Score
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {summary?.esg_compliance_score || 88}
              </span>
              <span className="text-xs font-bold text-slate-500">/ 100</span>
            </div>
          </div>

          {/* Mini Sparkline Simulation */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0 22 Q 25 18, 50 12 T 75 10 T 100 4"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <div className="flex items-center space-x-1 text-amber-600 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GHG Protocol Tier A</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">GRI Standard</span>
          </div>
        </div>
      </div>

      {/* 📈 Interactive Charts Suite (12-Column Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Chart Area (8 columns) */}
        <div className="lg:col-span-8 glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Monthly GHG Emissions & Scope Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Scope 1 Direct Gas, Scope 2 Electricity & Scope 3 Value Chain (Metric Tonnes CO2e)
              </p>
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveChartTab('area')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  activeChartTab === 'area'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Area Trajectory
              </button>
              <button
                onClick={() => setActiveChartTab('bar')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  activeChartTab === 'bar'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bar Scope Comparison
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'area' ? (
                <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScope1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorScope2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorScope3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#E5E7EB', 
                      borderRadius: '16px', 
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
                  <Area type="monotone" dataKey="scope1_tonnes" name="Scope 1 Direct (Gas)" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScope1)" />
                  <Area type="monotone" dataKey="scope2_tonnes" name="Scope 2 Purchased (Electricity)" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScope2)" />
                  <Area type="monotone" dataKey="scope3_tonnes" name="Scope 3 Value Chain" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScope3)" />
                </AreaChart>
              ) : (
                <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#E5E7EB', 
                      borderRadius: '16px', 
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
                  <Bar dataKey="scope1_tonnes" name="Scope 1" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="scope2_tonnes" name="Scope 2" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="scope3_tonnes" name="Scope 3" fill="#22C55E" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Distribution Donut Chart (4 columns) */}
        <div className="lg:col-span-4 glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Footprint Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Emissions share by resource category
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={6}
                  dataKey="total_tonnes"
                  nameKey="category"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E5E7EB', 
                    borderRadius: '16px', 
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🏢 Facility Energy & Carbon Intensity Heatmap Matrix */}
      <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Facility Intensity Heatmap Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Comparative Scope 1 & 2 carbon footprint ratings across operational facilities
            </p>
          </div>
          <button 
            onClick={() => navigate('/emissions')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View Full Facility Telemetry</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilityHeatmap.map((fac, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-glass hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{fac.facility}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  {fac.trend}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Scope 1 Gas:</span>
                <span className={`font-bold ${fac.scope1 === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {fac.scope1}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Scope 2 Grid:</span>
                <span className={`font-bold ${fac.scope2 === 'High' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {fac.scope2}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">Sustainability Index</span>
                <span className="text-sm font-black text-slate-900">{fac.score}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✨ AI Sustainability Advisor Section */}
      <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-5 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                ✨ AI Sustainability Advisor
              </h3>
              <p className="text-xs text-slate-500">
                Autonomous recommendations powered by Gemini AI engine for optimal decarbonization ROI
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/ai-advisor')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Open AI Interactive Chat</span>
          </button>
        </div>

        {/* AI Recommendation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiRecommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-glass hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-2xl ${rec.iconBg} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {rec.title}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${rec.impactColor}`}>
                      {rec.impact}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pl-13">
                    {rec.description}
                  </p>
                </div>

                {/* Card Footer Metrics */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="block text-[10px] font-semibold text-slate-400">Est. Savings</span>
                    <span className="text-xs font-black text-emerald-600">{rec.savings}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="block text-[10px] font-semibold text-slate-400">CO2 Impact</span>
                    <span className="text-xs font-black text-blue-600">{rec.co2Reduction}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="block text-[10px] font-semibold text-slate-400">AI Confidence</span>
                    <span className="text-xs font-black text-purple-600">{rec.confidence}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 Quick Action Shortcut Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 px-1">
          Quick Workflows & Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Upload Meter Data', icon: Plus, action: () => setIsModalOpen(true), color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
            { label: 'Generate ESG Report', icon: FileText, action: () => navigate('/reports'), color: 'bg-blue-50 text-blue-600 border-blue-200' },
            { label: 'Ask AI Advisor', icon: Bot, action: () => navigate('/ai-advisor'), color: 'bg-purple-50 text-purple-600 border-purple-200' },
            { label: 'Net-Zero Simulator', icon: Sliders, action: () => navigate('/simulator'), color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
            { label: 'Export Dashboard', icon: Download, action: () => alert('Exporting dashboard PDF...'), color: 'bg-amber-50 text-amber-600 border-amber-200' },
            { label: 'View Analytics', icon: BarChart3, action: () => navigate('/emissions'), color: 'bg-teal-50 text-teal-600 border-teal-200' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-glass hover:border-emerald-300 transition-all flex flex-col items-center justify-center text-center space-y-2 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-2xl ${item.color} border flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🕒 Recent Activity Timeline */}
      <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Recent System & Telemetry Activity
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Real-time audit log</span>
        </div>

        <div className="space-y-3">
          {recentActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div 
                key={act.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl ${act.badgeBg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                    <p className="text-[11px] text-slate-400">{act.user}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium shrink-0">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{act.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emission Modal */}
      <EmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchDashboardData}
      />
    </div>
  );
}
