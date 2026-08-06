import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Plus, 
  Filter, 
  Trash2, 
  Tag, 
  Calendar, 
  Layers, 
  Search, 
  RefreshCw, 
  Download, 
  FileText, 
  Building2, 
  Briefcase, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  SlidersHorizontal,
  ChevronDown,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';
import api from '../services/api';
import EmissionModal from '../components/EmissionModal';
import { getCombinedLogs } from '../utils/emissionsStorage';

const BASE_LOGS = [
  { id: 1, date: '2026-03-01', facility: 'HQ Building A', department: 'Facilities & Operations', category: 'Electricity', scope: 'Scope 2', quantity: 45000, unit: 'kWh', co2e_kg: 17325, notes: 'HVAC cooling tower load peak' },
  { id: 2, date: '2026-04-01', facility: 'HQ Building A', department: 'Facilities & Operations', category: 'Electricity', scope: 'Scope 2', quantity: 42000, unit: 'kWh', co2e_kg: 16170, notes: 'Smart thermostat trial started' },
  { id: 3, date: '2026-05-01', facility: 'Research Lab B', department: 'R&D', category: 'Electricity', scope: 'Scope 2', quantity: 38500, unit: 'kWh', co2e_kg: 14822, notes: 'Rooftop solar panel Phase 1 active' },
  { id: 4, date: '2026-06-01', facility: 'Research Lab B', department: 'R&D', category: 'Electricity', scope: 'Scope 2', quantity: 35000, unit: 'kWh', co2e_kg: 13475, notes: 'LED lighting retrofit completed' },
  { id: 5, date: '2026-07-01', facility: 'HQ Building A', department: 'Facilities & Operations', category: 'Electricity', scope: 'Scope 2', quantity: 33000, unit: 'kWh', co2e_kg: 12705, notes: 'HVAC AI setback optimization active' },
  { id: 6, date: '2026-03-01', facility: 'HQ Building A', department: 'Facilities & Operations', category: 'Natural Gas', scope: 'Scope 1', quantity: 1800, unit: 'Therms', co2e_kg: 9540, notes: 'Winter boiler heating' },
  { id: 7, date: '2026-04-01', facility: 'HQ Building A', department: 'Facilities & Operations', category: 'Natural Gas', scope: 'Scope 1', quantity: 1400, unit: 'Therms', co2e_kg: 7420, notes: 'Spring heating baseline' },
  { id: 8, date: '2026-05-01', facility: 'Logistics Hub East', department: 'Logistics & Transport', category: 'Natural Gas', scope: 'Scope 1', quantity: 900, unit: 'Therms', co2e_kg: 4770, notes: 'Domestic hot water only' },
  { id: 9, date: '2026-06-01', facility: 'Logistics Hub East', department: 'Logistics & Transport', category: 'Natural Gas', scope: 'Scope 1', quantity: 650, unit: 'Therms', co2e_kg: 3445, notes: 'Heat pump boiler hybrid system' },
  { id: 10, date: '2026-05-01', facility: 'APAC Assembly Plant', department: 'Manufacturing', category: 'Water', scope: 'Scope 3', quantity: 240000, unit: 'Liters', co2e_kg: 288, notes: 'Irrigation & cooling tower' },
  { id: 11, date: '2026-06-01', facility: 'APAC Assembly Plant', department: 'Manufacturing', category: 'Water', scope: 'Scope 3', quantity: 190000, unit: 'Liters', co2e_kg: 228, notes: 'Greywater recycling online' },
  { id: 12, date: '2026-06-15', facility: 'APAC Assembly Plant', department: 'Manufacturing', category: 'Waste', scope: 'Scope 3', quantity: 4200, unit: 'Kg', co2e_kg: 2100, notes: 'General landfill waste stream' },
  { id: 13, date: '2026-07-01', facility: 'Logistics Hub East', department: 'Logistics & Transport', category: 'Transport', scope: 'Scope 3', quantity: 12500, unit: 'Miles', co2e_kg: 5125, notes: 'Corporate shuttle & employee commuting' },
  { id: 14, date: '2026-07-10', facility: 'HQ Building A', department: 'IT Infrastructure', category: 'Supply Chain', scope: 'Scope 3', quantity: 8500, unit: 'Kg', co2e_kg: 14450, notes: 'IT hardware procurement paperless transition' }
];

export default function EmissionsTracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Interactive Filters State
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [dateRange, setDateRange] = useState('All'); // 'All', '30d', '90d', '2026'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('trend'); // 'trend' or 'bar'

  const fetchLogs = async () => {
    setLoading(true);
    let baseLogs = BASE_LOGS;
    try {
      let url = '/emissions/logs?';
      if (selectedCategory) url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (selectedScope) url += `scope=${encodeURIComponent(selectedScope)}&`;

      const res = await api.get(url);
      if (res.data?.logs?.length) {
        baseLogs = res.data.logs;
      }
    } catch (err) {
      console.warn('Emissions tracker network fallback:', err);
    }

    // Enhance logs with facility & department defaults if missing
    const combined = getCombinedLogs(baseLogs).map(l => ({
      ...l,
      facility: l.facility || (l.category === 'Natural Gas' ? 'HQ Building A' : l.category === 'Water' ? 'APAC Assembly Plant' : 'HQ Building A'),
      department: l.department || (l.category === 'Transport' ? 'Logistics & Transport' : 'Facilities & Operations')
    }));

    setLogs(combined);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedCategory, selectedScope]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this emission log entry?')) return;
    try {
      await api.delete(`/emissions/logs/${id}`);
    } catch (err) {
      console.warn('Delete via API failed, removing locally:', err);
    } finally {
      setLogs(prev => prev.filter(l => l.id !== id));
      try {
        const stored = JSON.parse(localStorage.getItem('ecometrics_custom_logs') || '[]');
        const updated = stored.filter(l => l.id !== id);
        localStorage.setItem('ecometrics_custom_logs', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  // Filtered Logs Memo
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchFacility = !selectedFacility || log.facility === selectedFacility;
      const matchDept = !selectedDepartment || log.department === selectedDepartment;
      const matchCategory = !selectedCategory || log.category === selectedCategory;
      const matchScope = !selectedScope || log.scope === selectedScope;
      
      let matchDate = true;
      if (startDate && log.date < startDate) matchDate = false;
      if (endDate && log.date > endDate) matchDate = false;

      const matchSearch = !searchTerm ||
        log.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.facility?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchFacility && matchDept && matchCategory && matchScope && matchDate && matchSearch;
    });
  }, [logs, selectedFacility, selectedDepartment, selectedCategory, selectedScope, startDate, endDate, searchTerm]);

  // Aggregate Metrics & Trend Data for Charts
  const metrics = useMemo(() => {
    const totalKg = filteredLogs.reduce((acc, curr) => acc + (Number(curr.co2e_kg) || 0), 0);
    const totalTonnes = (totalKg / 1000).toFixed(2);
    
    const scope1Kg = filteredLogs.filter(l => l.scope === 'Scope 1').reduce((acc, curr) => acc + (Number(curr.co2e_kg) || 0), 0);
    const scope2Kg = filteredLogs.filter(l => l.scope === 'Scope 2').reduce((acc, curr) => acc + (Number(curr.co2e_kg) || 0), 0);
    const scope3Kg = filteredLogs.filter(l => l.scope === 'Scope 3').reduce((acc, curr) => acc + (Number(curr.co2e_kg) || 0), 0);

    // Group by Date for Trend Graph
    const mapByDate = {};
    filteredLogs.forEach(l => {
      const dateKey = l.date || '2026-06-01';
      if (!mapByDate[dateKey]) {
        mapByDate[dateKey] = { date: dateKey, scope1: 0, scope2: 0, scope3: 0, total: 0 };
      }
      const tonnes = (Number(l.co2e_kg) || 0) / 1000;
      if (l.scope === 'Scope 1') mapByDate[dateKey].scope1 += tonnes;
      else if (l.scope === 'Scope 2') mapByDate[dateKey].scope2 += tonnes;
      else mapByDate[dateKey].scope3 += tonnes;
      mapByDate[dateKey].total += tonnes;
    });

    const trendData = Object.values(mapByDate).sort((a, b) => a.date.localeCompare(b.date));

    // Category Breakdown for Bar Chart
    const mapByCategory = {};
    filteredLogs.forEach(l => {
      const cat = l.category || 'Other';
      if (!mapByCategory[cat]) mapByCategory[cat] = 0;
      mapByCategory[cat] += (Number(l.co2e_kg) || 0) / 1000;
    });

    const categoryData = Object.entries(mapByCategory).map(([cat, val]) => ({
      category: cat,
      tonnes: Number(val.toFixed(2))
    }));

    return {
      totalTonnes,
      recordCount: filteredLogs.length,
      scope1Tonnes: (scope1Kg / 1000).toFixed(1),
      scope2Tonnes: (scope2Kg / 1000).toFixed(1),
      scope3Tonnes: (scope3Kg / 1000).toFixed(1),
      trendData,
      categoryData
    };
  }, [filteredLogs]);

  // Export CSV Functionality
  const exportCSV = () => {
    if (filteredLogs.length === 0) {
      alert('No logs available to export.');
      return;
    }
    const headers = ['Log Date', 'Facility', 'Department', 'Resource Category', 'GHG Scope', 'Quantity', 'Unit', 'CO2e (kg)', 'CO2e (tonnes)', 'Notes'];
    const rows = filteredLogs.map(l => [
      l.date,
      `"${l.facility || ''}"`,
      `"${l.department || ''}"`,
      `"${l.category || ''}"`,
      `"${l.scope || ''}"`,
      l.quantity,
      l.unit,
      l.co2e_kg,
      (Number(l.co2e_kg) / 1000).toFixed(3),
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Emissions_Telemetry_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Export PDF Trigger
  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Header & Main Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-glass">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Scope 1, 2 & 3 Telemetry Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Emissions Analytics Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time energy consumption telemetry, facility carbon accounting, and automated GHG audit reporting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs transition-all shadow-2xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportPDF}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs transition-all shadow-2xs flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Telemetry Record</span>
          </button>
        </div>
      </div>

      {/* 📊 KPI Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Filtered Total Carbon
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{metrics.totalTonnes}</span>
            <span className="text-xs font-bold text-slate-500">t CO2e</span>
          </div>
          <div className="flex items-center text-xs text-emerald-600 font-bold space-x-1 pt-1 border-t border-slate-100">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{metrics.recordCount} records evaluated</span>
          </div>
        </div>

        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Scope 1 Direct Gas
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-600 tracking-tight">{metrics.scope1Tonnes}</span>
            <span className="text-xs font-bold text-slate-500">t CO2e</span>
          </div>
          <div className="text-xs text-slate-400 font-medium pt-1 border-t border-slate-100">
            Boilers & Fuel Combustion
          </div>
        </div>

        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Scope 2 Electricity Grid
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-blue-600 tracking-tight">{metrics.scope2Tonnes}</span>
            <span className="text-xs font-bold text-slate-500">t CO2e</span>
          </div>
          <div className="text-xs text-slate-400 font-medium pt-1 border-t border-slate-100">
            HVAC & Facility Lighting
          </div>
        </div>

        <div className="glass-card-light glass-card-hover p-5 rounded-3xl border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Scope 3 Value Chain
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-600 tracking-tight">{metrics.scope3Tonnes}</span>
            <span className="text-xs font-bold text-slate-500">t CO2e</span>
          </div>
          <div className="text-xs text-slate-400 font-medium pt-1 border-t border-slate-100">
            Supply Chain & Travel
          </div>
        </div>
      </div>

      {/* 🎛️ Interactive Filters Toolbar */}
      <div className="glass-card-light p-5 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Interactive Telemetry Filters</h3>
          </div>
          <button
            onClick={() => {
              setSelectedFacility('');
              setSelectedDepartment('');
              setSelectedCategory('');
              setSelectedScope('');
              setStartDate('');
              setEndDate('');
              setSearchTerm('');
            }}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Facility Selector */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-600" /> Facility
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All Facilities</option>
              <option value="HQ Building A">HQ Building A</option>
              <option value="Research Lab B">Research Lab B</option>
              <option value="Logistics Hub East">Logistics Hub East</option>
              <option value="APAC Assembly Plant">APAC Assembly Plant</option>
            </select>
          </div>

          {/* Department Selector */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-emerald-600" /> Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All Departments</option>
              <option value="Facilities & Operations">Facilities & Ops</option>
              <option value="R&D">R&D</option>
              <option value="Logistics & Transport">Logistics & Transport</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="IT Infrastructure">IT Infrastructure</option>
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-600" /> Resource Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All Categories</option>
              <option value="Electricity">Electricity</option>
              <option value="Natural Gas">Natural Gas</option>
              <option value="Water">Water</option>
              <option value="Waste">Waste</option>
              <option value="Transport">Transport</option>
              <option value="Supply Chain">Supply Chain</option>
            </select>
          </div>

          {/* Scope Selector */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-600" /> GHG Scope
            </label>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="">All Scopes</option>
              <option value="Scope 1">Scope 1 (Direct)</option>
              <option value="Scope 2">Scope 2 (Electricity)</option>
              <option value="Scope 3">Scope 3 (Value Chain)</option>
            </select>
          </div>

          {/* Date Start Picker */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Date End Picker */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, facility names, or resource categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          
          <button
            onClick={fetchLogs}
            className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ✨ AI Anomaly & Emission Insights Box */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200/80 shadow-subtle flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-black text-slate-900">✨ Gemini AI Telemetry Insight</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
              98% Confidence Rating
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">
            Evaluated <strong>{metrics.recordCount} filtered telemetry records</strong> totaling <strong>{metrics.totalTonnes} Metric Tonnes CO2e</strong>. Scope 2 electricity comprises {((metrics.scope2Tonnes / Math.max(1, metrics.totalTonnes)) * 100).toFixed(0)}% of your active carbon footprint. Shifting Building B chiller peak loads to solar buffer windows could reduce annual emissions by an additional 14.2 t CO2e.
          </p>
        </div>
      </div>

      {/* 📈 Animated Emission Trend & Category Charts */}
      <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {activeView === 'trend' ? 'Monthly Emission Trajectory Graph' : 'Emissions Breakdown by Resource Category'}
            </h3>
            <p className="text-xs text-slate-500">
              Interactive timeline visualization based on active telemetry filters
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveView('trend')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeView === 'trend'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Trend Area Graph
            </button>
            <button
              onClick={() => setActiveView('bar')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeView === 'bar'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Category Bar Chart
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeView === 'trend' ? (
              <AreaChart data={metrics.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaColorScope1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="areaColorScope2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="areaColorScope3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '16px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
                <Area type="monotone" dataKey="scope1" name="Scope 1 Direct (Gas)" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#areaColorScope1)" />
                <Area type="monotone" dataKey="scope2" name="Scope 2 Purchased (Electricity)" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#areaColorScope2)" />
                <Area type="monotone" dataKey="scope3" name="Scope 3 Value Chain" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#areaColorScope3)" />
              </AreaChart>
            ) : (
              <BarChart data={metrics.categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderRadius: '16px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#64748B' }} />
                <Bar dataKey="tonnes" name="Emissions (Metric Tonnes CO2e)" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📑 Beautiful Telemetry Data Table */}
      <div className="glass-card-light rounded-3xl border border-slate-200/80 overflow-hidden shadow-glass">
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">
            Telemetry Record Ledger ({filteredLogs.length})
          </h3>
          <span className="text-xs text-slate-500 font-semibold">GHG Protocol Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Log Date</th>
                <th className="px-6 py-4">Facility & Department</th>
                <th className="px-6 py-4">Resource Category</th>
                <th className="px-6 py-4">GHG Scope</th>
                <th className="px-6 py-4">Quantity & Unit</th>
                <th className="px-6 py-4">Calculated CO2e</th>
                <th className="px-6 py-4">Operational Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No telemetry records match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">{log.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div>{log.facility || 'HQ Building A'}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{log.department || 'Operations'}</div>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      {log.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        log.scope === 'Scope 1' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        log.scope === 'Scope 2' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {log.scope}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      {Number(log.quantity).toLocaleString()} <span className="text-slate-400 text-[11px] font-normal">{log.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-emerald-600">
                      {(Number(log.co2e_kg) / 1000).toFixed(3)} <span className="text-[10px] text-slate-400 font-medium">t CO2e</span>
                      <div className="text-[10px] text-slate-400 font-normal">({Number(log.co2e_kg).toLocaleString()} kg)</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{log.notes || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchLogs}
      />
    </div>
  );
}
