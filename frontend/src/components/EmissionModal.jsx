import React, { useState } from 'react';
import { X, PlusCircle, Calendar, Tag, Hash, FileText } from 'lucide-react';
import api from '../services/api';
import { saveCustomLog } from '../utils/emissionsStorage';

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

    saveCustomLog({
      category,
      quantity: Number(quantity),
      unit,
      date,
      notes
    });

    try {
      await api.post('/emissions/logs', {
        category,
        quantity: Number(quantity),
        unit,
        date,
        notes
      });
    } catch (err) {
      console.warn('Network call error in modal, saved to local storage:', err);
    } finally {
      if (onRefresh) onRefresh();
      if (onClose) onClose();
      setQuantity('');
      setNotes('');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Log Meter Telemetry</h3>
              <p className="text-xs text-slate-500">Record Scope 1-3 consumption data</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" /> Resource Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-600" /> Quantity
              </label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 4500"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Unit of Measure</label>
              <input
                type="text"
                value={unit}
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Log Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" /> Operational Context & Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Monthly meter reading for Building C HVAC chiller"
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-2xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Calculating CO2e...' : 'Save Log Telemetry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
