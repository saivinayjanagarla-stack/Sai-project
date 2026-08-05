import React, { useState, useEffect } from 'react';
import { Sliders, DollarSign, TrendingDown, Clock, ShieldCheck, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../services/api';

export default function ScenarioSimulator() {
  const [solarPvKw, setSolarPvKw] = useState(250);
  const [heatPumpPct, setHeatPumpPct] = useState(50);
  const [evFleetPct, setEvFleetPct] = useState(40);
  const [hvacAiControl, setHvacAiControl] = useState(true);
  const [ledLightingPct, setLedLightingPct] = useState(80);

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.post('/simulator/run', {
        solar_pv_kw: Number(solarPvKw),
        heat_pump_pct: Number(heatPumpPct),
        ev_fleet_pct: Number(evFleetPct),
        hvac_ai_control: Boolean(hvacAiControl),
        led_lighting_pct: Number(ledLightingPct)
      });
      setSimResult(res.data.simulation);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [solarPvKw, heatPumpPct, evFleetPct, hvacAiControl, ledLightingPct]);

  const resetDefaults = () => {
    setSolarPvKw(250);
    setHeatPumpPct(50);
    setEvFleetPct(40);
    setHvacAiControl(true);
    setLedLightingPct(80);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-eco-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4" /> Predictive Modeling Engine
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Net-Zero 2030 Retrofit Scenario Simulator</h1>
          <p className="text-xs text-slate-400 mt-1">Simulate green technology investments, calculate CapEx, annual OpEx savings, and forecast decarbonization timelines.</p>
        </div>

        <button
          onClick={resetDefaults}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Scenario Variables</span>
        </button>
      </div>

      {/* Simulator Controls & Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retrofit Variable Sliders */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-eco-400" /> Green Retrofit Variables
          </h3>

          {/* Slider 1: Solar PV */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Rooftop Solar PV Array</span>
              <span className="font-extrabold text-eco-400">{solarPvKw} kW</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="25"
              value={solarPvKw}
              onChange={(e) => setSolarPvKw(e.target.value)}
              className="w-full accent-eco-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Offset location-based grid electricity draw.</p>
          </div>

          {/* Slider 2: Heat Pump */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Boiler to Heat Pump Conversion</span>
              <span className="font-extrabold text-eco-400">{heatPumpPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={heatPumpPct}
              onChange={(e) => setHeatPumpPct(e.target.value)}
              className="w-full accent-eco-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Eliminate Scope 1 natural gas combustion emissions.</p>
          </div>

          {/* Slider 3: EV Fleet */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Corporate EV Fleet Transition</span>
              <span className="font-extrabold text-eco-400">{evFleetPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={evFleetPct}
              onChange={(e) => setEvFleetPct(e.target.value)}
              className="w-full accent-eco-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Replace internal combustion fleet vehicles.</p>
          </div>

          {/* Toggle: HVAC AI */}
          <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">HVAC AI Setback Optimization</span>
              <span className="text-[10px] text-slate-500">Autonomous occupancy predictive cooling</span>
            </div>
            <input
              type="checkbox"
              checked={hvacAiControl}
              onChange={(e) => setHvacAiControl(e.target.checked)}
              className="w-5 h-5 accent-eco-400 cursor-pointer"
            />
          </div>

          {/* Slider 5: LED Retrofit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Smart LED Lighting Upgrade</span>
              <span className="font-extrabold text-eco-400">{ledLightingPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={ledLightingPct}
              onChange={(e) => setLedLightingPct(e.target.value)}
              className="w-full accent-eco-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Simulation Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annual CO2e Reduction</div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-eco-400">-{simResult?.totalReductionTonnes}</span>
                <span className="text-xs text-slate-400">tonnes/yr</span>
              </div>
              <div className="mt-2 text-xs text-eco-400 font-bold">
                {simResult?.reductionPercentage}% Paris 1.5°C Cut
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Project CapEx</div>
              <div className="mt-2 text-3xl font-black text-white">
                ${simResult?.totalCapex?.toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Initial Green Capital
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Simple Payback</div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-amber-400">{simResult?.paybackYears}</span>
                <span className="text-xs text-slate-400">years</span>
              </div>
              <div className="mt-2 text-xs text-emerald-400 font-semibold">
                ${simResult?.annualSavings?.toLocaleString()}/yr utility savings
              </div>
            </div>
          </div>

          {/* Projected Net-Zero Trajectory Bar Chart */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">2026 – 2030 Decarbonization Trajectory</h3>
                <p className="text-xs text-slate-400">Baseline vs Retrofit Projected Annual CO2e (Tonnes)</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-bold text-eco-400">Net-Zero Pathway</span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={simResult?.timeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Bar dataKey="baseline" name="Baseline Emissions (t CO2e)" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="projected" name="Projected Retrofit Emissions (t CO2e)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Feasibility Assessment Box */}
          <div className="p-5 rounded-2xl bg-eco-950/40 border border-eco-500/30 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-eco-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-eco-300">AI Feasibility & Technical Recommendation</h4>
              <p className="text-slate-300 leading-relaxed">{simResult?.aiAssessment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
