import React, { useState, useEffect } from 'react';
import { Flame, Plus, Filter, Trash2, Tag, Calendar, Layers, Search, RefreshCw } from 'lucide-react';
import api from '../services/api';
import EmissionModal from '../components/EmissionModal';
import { getCombinedLogs } from '../utils/emissionsStorage';

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
  { id: 12, date: '2026-06-15', category: 'Waste', scope: 'Scope 3', quantity: 4200, unit: 'Kg', co2e_kg: 2100, notes: 'General landfill waste stream' },
  { id: 13, date: '2026-07-01', category: 'Transport', scope: 'Scope 3', quantity: 12500, unit: 'Miles', co2e_kg: 5125, notes: 'Corporate shuttle & employee commuting' },
  { id: 14, date: '2026-07-10', category: 'Supply Chain', scope: 'Scope 3', quantity: 8500, unit: 'Kg', co2e_kg: 14450, notes: 'IT hardware procurement paperless transition' }
];

export default function EmissionsTracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedScope, setSelectedScope] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = async () => {
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
      console.warn('Emissions tracker network fallback, using combined logs:', err);
    }
    setLogs(getCombinedLogs(baseLogs));
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

  const filteredLogs = logs.filter(log => {
    const matchCategory = !selectedCategory || log.category === selectedCategory;
    const matchScope = !selectedScope || log.scope === selectedScope;
    const matchSearch = !searchTerm ||
      log.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchScope && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-eco-400 uppercase tracking-wider">
            <Flame className="w-4 h-4" /> Scope 1, 2 & 3 Ledger
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Resource & Emission Data Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Audit operational energy, water, gas, waste, and supply chain carbon inventory.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-eco-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Consumption Record</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search notes or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-eco-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-eco-500"
          >
            <option value="">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Natural Gas">Natural Gas</option>
            <option value="Water">Water</option>
            <option value="Waste">Waste</option>
            <option value="Transport">Transport</option>
            <option value="Supply Chain">Supply Chain</option>
          </select>

          <select
            value={selectedScope}
            onChange={(e) => setSelectedScope(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-eco-500"
          >
            <option value="">All Scopes</option>
            <option value="Scope 1">Scope 1 (Direct)</option>
            <option value="Scope 2">Scope 2 (Electricity)</option>
            <option value="Scope 3">Scope 3 (Value Chain)</option>
          </select>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Log Date</th>
                <th className="px-6 py-4">Resource Category</th>
                <th className="px-6 py-4">GHG Scope</th>
                <th className="px-6 py-4">Quantity & Unit</th>
                <th className="px-6 py-4">Calculated CO2e</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-xs">
                    No emission records found matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{log.date}</td>
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-eco-400" />
                      {log.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        log.scope === 'Scope 1' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                        log.scope === 'Scope 2' ? 'bg-blue-950 text-blue-400 border border-blue-500/30' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {log.scope}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200">
                      {Number(log.quantity).toLocaleString()} <span className="text-slate-400 text-[11px]">{log.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-eco-400">
                      {(Number(log.co2e_kg) / 1000).toFixed(3)} <span className="text-[10px] text-slate-400">t CO2e</span>
                      <div className="text-[10px] text-slate-500 font-normal">({Number(log.co2e_kg).toLocaleString()} kg)</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{log.notes || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
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
