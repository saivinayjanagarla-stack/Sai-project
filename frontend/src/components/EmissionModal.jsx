import React, { useState } from 'react';
import { X, PlusCircle, Calendar, Tag, Hash, FileText } from 'lucide-react';
import api from '../services/api';

export default function EmissionModal({ isOpen, onClose, onRefresh }) {
  const [category, setCategory] = useState('Electricity');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kWh');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const unitMap = {
    Electricity: 'kWh',
    'Natural Gas': 'Therms',
    Water: 'Liters',
    Waste: 'Kg',
    Transport: 'Miles',
    'Supply Chain': 'Kg'
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setUnit(unitMap[cat] || 'Units');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!quantity || Number(quantity) <= 0) {
      setError('Please enter a valid positive quantity.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/emissions/logs', {
        category,
        quantity: Number(quantity),
        unit,
        date,
        notes
      });
    } catch (err) {
      console.warn('Network call error in modal, continuing to refresh view:', err);
    } finally {
      if (onRefresh) onRefresh();
      if (onClose) onClose();
      setQuantity('');
      setNotes('');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-eco-400" />
            <h3 className="font-bold text-lg text-white">Log Operational Consumption</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-eco-400" /> Resource Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500"
            >
              <option value="Electricity">Electricity (Scope 2)</option>
              <option value="Natural Gas">Natural Gas (Scope 1)</option>
              <option value="Water">Water Usage (Scope 3)</option>
              <option value="Waste">Waste Generation (Scope 3)</option>
              <option value="Transport">Fleet / Travel (Scope 3)</option>
              <option value="Supply Chain">Supply Chain (Scope 3)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-eco-400" /> Consumption Quantity
              </label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 4500"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit of Measure</label>
              <input
                type="text"
                value={unit}
                readOnly
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-eco-400" /> Log Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-eco-400" /> Notes & Operational Context
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Monthly meter reading for Building C HVAC"
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-eco-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-eco-400 hover:bg-eco-300 transition-all shadow-lg shadow-eco-500/20 disabled:opacity-50"
            >
              {loading ? 'Calculating CO2e...' : 'Save Log Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
