import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sliders, 
  DollarSign, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Sun, 
  Zap, 
  ZapOff, 
  Car, 
  Lightbulb, 
  ArrowUpRight, 
  Target, 
  Layers, 
  Calculator, 
  Award,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  ComposedChart, 
  Line 
} from 'recharts';
import api from '../services/api';

function calculateSimulation(solarKw, heatPumpP, evFleetP, hvacAi, ledP) {
  const solarCo2 = Number(solarKw) * 0.45;
  const heatPumpCo2 = (Number(heatPumpP) / 100) * 45;
  const evCo2 = (Number(evFleetP) / 100) * 18;
  const hvacCo2 = hvacAi ? 14 : 0;
  const ledCo2 = (Number(ledP) / 100) * 12;

  const totalReductionTonnes = Math.round(solarCo2 + heatPumpCo2 + evCo2 + hvacCo2 + ledCo2);
  const baselineEmissions = 160;
  const reductionPercentage = Math.min(95, Math.round((totalReductionTonnes / baselineEmissions) * 100));

  const solarCapex = Number(solarKw) * 1100;
  const heatPumpCapex = (Number(heatPumpP) / 100) * 65000;
  const evCapex = (Number(evFleetP) / 100) * 42000;
  const hvacCapex = hvacAi ? 15000 : 0;
  const ledCapex = (Number(ledP) / 100) * 18000;

  const totalCapex = Math.round(solarCapex + heatPumpCapex + evCapex + hvacCapex + ledCapex);
  const annualSavings = Math.round(totalReductionTonnes * 165);
  const paybackYears = annualSavings > 0 ? (totalCapex / annualSavings).toFixed(1) : 'N/A';

  const years = ['2026', '2027', '2028', '2029', '2030'];
  const timeline = years.map((yr, idx) => {
    const factor = (idx + 1) / 5;
    const proj = Math.max(10, Math.round(baselineEmissions - (totalReductionTonnes * factor)));
    return {
      year: yr,
      baseline: baselineEmissions,
      projected: proj
    };
  });

  const financialTimeline = years.map((yr, idx) => {
    const cumSavings = annualSavings * (idx + 1);
    return {
      year: yr,
      capexInvestment: totalCapex,
      cumulativeSavings: cumSavings
    };
  });

  const aiAssessment = `This green retrofit scenario achieves an annual reduction of ${totalReductionTonnes} Metric Tonnes CO2e (${reductionPercentage}% Paris 1.5°C Alignment Target). Initial green investment CapEx is $${totalCapex.toLocaleString()} with an estimated annual OpEx savings of $${annualSavings.toLocaleString()}/yr. Simple payback period evaluated at ${paybackYears} years. Highly viable candidate for IRA Clean Energy 30% ITC tax incentives.`;

  return {
    totalReductionTonnes,
    reductionPercentage,
    totalCapex,
    annualSavings,
    paybackYears,
    timeline,
    financialTimeline,
    aiAssessment
  };
}

export default function ScenarioSimulator() {
  const [solarPvKw, setSolarPvKw] = useState(700);
  const [heatPumpPct, setHeatPumpPct] = useState(85);
  const [evFleetPct, setEvFleetPct] = useState(40);
  const [hvacAiControl, setHvacAiControl] = useState(true);
  const [ledLightingPct, setLedLightingPct] = useState(80);
  const [masterTargetPct, setMasterTargetPct] = useState(78);

  const [simResult, setSimResult] = useState(() =>
    calculateSimulation(700, 85, 40, true, 80)
  );

  const runSimulation = async () => {
    const computed = calculateSimulation(solarPvKw, heatPumpPct, evFleetPct, hvacAiControl, ledLightingPct);
    setSimResult(computed);

    try {
      const res = await api.post('/simulator/run', {
        solar_pv_kw: Number(solarPvKw),
        heat_pump_pct: Number(heatPumpPct),
        ev_fleet_pct: Number(evFleetPct),
        hvac_ai_control: Boolean(hvacAiControl),
        led_lighting_pct: Number(ledLightingPct)
      });
      if (res.data?.simulation) {
        setSimResult(res.data.simulation);
      }
    } catch (err) {
      console.warn('Simulation network call fallback:', err);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [solarPvKw, heatPumpPct, evFleetPct, hvacAiControl, ledLightingPct]);

  // Master slider auto-scales sub-variables
  const handleMasterTargetChange = (val) => {
    setMasterTargetPct(val);
    const ratio = val / 100;
    setSolarPvKw(Math.round(1000 * ratio));
    setHeatPumpPct(Math.min(100, Math.round(100 * ratio)));
    setEvFleetPct(Math.min(100, Math.round(90 * ratio)));
    setLedLightingPct(Math.min(100, Math.round(95 * ratio)));
  };

  // Preset Scenario Handlers
  const applyAggressiveNetZero = () => {
    setSolarPvKw(950);
    setHeatPumpPct(100);
    setEvFleetPct(90);
    setHvacAiControl(true);
    setLedLightingPct(100);
    setMasterTargetPct(95);
  };

  const applySolarFocus = () => {
    setSolarPvKw(800);
    setHeatPumpPct(40);
    setEvFleetPct(30);
    setHvacAiControl(true);
    setLedLightingPct(70);
    setMasterTargetPct(65);
  };

  const resetDefaults = () => {
    setSolarPvKw(250);
    setHeatPumpPct(50);
    setEvFleetPct(40);
    setHvacAiControl(true);
    setLedLightingPct(80);
    setMasterTargetPct(50);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-glass">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>AI Predictive Modeling & CapEx Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">📊 Net-Zero 2030 Retrofit Simulator</h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate decarbonization scenarios, calculate CapEx investments, utility OpEx savings, and forecast 2026–2030 pathways.
          </p>
        </div>

        {/* Preset Scenario Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={applyAggressiveNetZero}
            className="px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-extrabold transition-all shadow-2xs"
          >
            🌱 Aggressive 95% Cut
          </button>
          <button
            onClick={applySolarFocus}
            className="px-3.5 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-extrabold transition-all shadow-2xs"
          >
            ☀️ Solar Microgrid Focus
          </button>
          <button
            onClick={resetDefaults}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200"
            title="Reset Scenario"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🎯 Master Carbon Reduction Target Slider Card */}
      <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Master Carbon Reduction Target Slider
              </h3>
              <p className="text-xs text-slate-500">
                Auto-scale multi-variable green technology retrofits across your facility portfolio
              </p>
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">{masterTargetPct}% Target Cut</span>
        </div>

        <input
          type="range"
          min="10"
          max="95"
          step="1"
          value={masterTargetPct}
          onChange={(e) => handleMasterTargetChange(Number(e.target.value))}
          className="w-full accent-emerald-600 h-3 bg-slate-100 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-extrabold text-slate-400">
          <span>10% Baseline Shaving</span>
          <span>50% Paris Minimum</span>
          <span>95% Deep Decarbonization</span>
        </div>
      </div>

      {/* 🛠️ Scenario Builder & Gauge Meter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scenario Controls Box (5 columns) */}
        <div className="lg:col-span-5 glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-6 shadow-glass">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" /> Retrofit Technology Variables
          </h3>

          {/* Slider 1: Solar PV */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" /> Rooftop Solar PV Array
              </span>
              <span className="font-black text-emerald-600">{solarPvKw} kW</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={solarPvKw}
              onChange={(e) => setSolarPvKw(e.target.value)}
              className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-medium">Offset grid electricity draw ($1,100 / kW CapEx).</p>
          </div>

          {/* Slider 2: Heat Pump */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-500" /> Boiler to Heat Pump Conversion
              </span>
              <span className="font-black text-emerald-600">{heatPumpPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={heatPumpPct}
              onChange={(e) => setHeatPumpPct(e.target.value)}
              className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-medium">Eliminate Scope 1 natural gas combustion emissions.</p>
          </div>

          {/* Slider 3: EV Fleet */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-purple-500" /> Corporate EV Fleet Transition
              </span>
              <span className="font-black text-emerald-600">{evFleetPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={evFleetPct}
              onChange={(e) => setEvFleetPct(e.target.value)}
              className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-medium">Replace internal combustion fleet vehicles.</p>
          </div>

          {/* Toggle: HVAC AI */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block flex items-center gap-1.5">
                <ZapOff className="w-3.5 h-3.5 text-emerald-600" /> HVAC AI Setback Control
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Autonomous occupancy predictive cooling</span>
            </div>
            <input
              type="checkbox"
              checked={hvacAiControl}
              onChange={(e) => setHvacAiControl(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Slider 5: LED Retrofit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Smart LED Lighting Upgrade
              </span>
              <span className="font-black text-emerald-600">{ledLightingPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={ledLightingPct}
              onChange={(e) => setLedLightingPct(e.target.value)}
              className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Gauge Meter & Savings Metrics (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Output Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="glass-card-light p-4 rounded-3xl border border-slate-200/80 shadow-subtle space-y-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Annual CO2 Cut</span>
              <div className="text-2xl font-black text-emerald-600">-{simResult?.totalReductionTonnes} t</div>
              <span className="text-[10px] text-slate-400 font-medium">tonnes CO2e/yr</span>
            </div>

            <div className="glass-card-light p-4 rounded-3xl border border-slate-200/80 shadow-subtle space-y-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Project CapEx</span>
              <div className="text-2xl font-black text-slate-900">${(simResult?.totalCapex / 1000).toFixed(0)}k</div>
              <span className="text-[10px] text-slate-400 font-medium">Initial Green Capital</span>
            </div>

            <div className="glass-card-light p-4 rounded-3xl border border-slate-200/80 shadow-subtle space-y-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Annual OpEx Savings</span>
              <div className="text-2xl font-black text-blue-600">${(simResult?.annualSavings / 1000).toFixed(0)}k/yr</div>
              <span className="text-[10px] text-slate-400 font-medium">Utility Bill Offset</span>
            </div>

            <div className="glass-card-light p-4 rounded-3xl border border-slate-200/80 shadow-subtle space-y-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Simple Payback</span>
              <div className="text-2xl font-black text-amber-600">{simResult?.paybackYears} yrs</div>
              <span className="text-[10px] text-emerald-600 font-bold">IRA 30% Eligible</span>
            </div>
          </div>

          {/* Animated Gauge Ring & Live Prediction Graph */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* SVG Animated Gauge Ring (4 cols) */}
            <div className="md:col-span-4 glass-card-light p-5 rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-2 shadow-glass">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Net-Zero Alignment Gauge
              </span>

              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-700 ease-out"
                    strokeDasharray={`${simResult?.reductionPercentage || 75}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">{simResult?.reductionPercentage}%</span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase">Paris 1.5°C Target</span>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-700">
                {simResult?.reductionPercentage > 75 ? '🌱 Excellent Alignment' : '⚠️ Sub-optimal Target'}
              </span>
            </div>

            {/* Live Prediction Trajectory Graph (8 cols) */}
            <div className="md:col-span-8 glass-card-light p-5 rounded-3xl border border-slate-200/80 space-y-2 shadow-glass">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-slate-900">2026 – 2030 Emission Pathway</h4>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Prediction
                </span>
              </div>

              <div className="h-44 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={simResult?.timeline || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', fontSize: '11px' }} />
                    <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: '10px', color: '#64748B' }} />
                    <Bar dataKey="baseline" name="Baseline (t CO2e)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="projected" name="Retrofit (t CO2e)" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Investment vs Savings Chart */}
          <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-3 shadow-glass">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Investment vs OpEx Savings Forecast</h3>
                <p className="text-xs text-slate-500">Cumulative CapEx vs Cumulative Energy Bill Savings (2026 – 2030)</p>
              </div>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <Calculator className="w-4 h-4" /> Savings Calculator
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={simResult?.financialTimeline || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '16px', fontSize: '12px' }} />
                  <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
                  <Bar dataKey="capexInvestment" name="Initial CapEx ($)" fill="#CBD5E1" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey="cumulativeSavings" name="Cumulative Savings ($)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ✨ AI Recommendation & Feasibility Panel */}
          <div className="p-5 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 flex items-start space-x-3.5 shadow-subtle">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-black text-emerald-900">AI Feasibility & Technical Investment Recommendation</h4>
              <p className="text-slate-700 leading-relaxed font-medium">{simResult?.aiAssessment}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
