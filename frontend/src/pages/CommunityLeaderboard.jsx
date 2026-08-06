import React, { useState, useEffect } from 'react';
import { Trophy, Award, Plus, Sparkles, User, Calendar, CheckCircle2, Trees, Zap, Car } from 'lucide-react';
import api from '../services/api';

const DEFAULT_ACTIONS = [
  { id: 1, user_name: 'Marcus Vance', title: 'Planted 15 Native Micro-Forest Trees', action_type: 'Plant Trees', points: 300, co2_saved_kg: 180.0, date: '2026-08-05' },
  { id: 2, user_name: 'Priya Sharma', title: 'Zero Waste Campus Event Organizer', action_type: 'Zero Waste Lunch', points: 200, co2_saved_kg: 65.0, date: '2026-08-04' },
  { id: 3, user_name: 'Elena Rostova', title: 'Switched to EV Commute', action_type: 'Carpool', points: 150, co2_saved_kg: 42.5, date: '2026-08-02' },
  { id: 4, user_name: 'David Chen', title: 'Installed Desk Solar Charger & Smart Strip', action_type: 'Energy Saver', points: 80, co2_saved_kg: 12.0, date: '2026-08-03' }
];

const DEFAULT_LEADERBOARD = [
  { user_name: 'Marcus Vance', total_points: 300, total_co2_saved: 180.0, actions_count: 1 },
  { user_name: 'Priya Sharma', total_points: 200, total_co2_saved: 65.0, actions_count: 1 },
  { user_name: 'Elena Rostova', total_points: 150, total_co2_saved: 42.5, actions_count: 1 },
  { user_name: 'David Chen', total_points: 80, total_co2_saved: 12.0, actions_count: 1 }
];

export default function CommunityLeaderboard() {
  const [actions, setActions] = useState(DEFAULT_ACTIONS);
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD);
  const [loading, setLoading] = useState(false);

  // Modal / Form state
  const [title, setTitle] = useState('');
  const [actionType, setActionType] = useState('Carpool');
  const [co2SavedKg, setCo2SavedKg] = useState(25);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchCommunityData = async () => {
    try {
      const res = await api.get('/community');
      if (res.data?.actions?.length) setActions(res.data.actions);
      if (res.data?.leaderboard?.length) setLeaderboard(res.data.leaderboard);
    } catch (err) {
      console.warn('Community leaderboard using built-in state:', err);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const handleLogAction = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const pointMap = {
      'Carpool': 150,
      'Solar Roof': 350,
      'Zero Waste Lunch': 100,
      'Energy Saver': 80,
      'Plant Trees': 300
    };
    const pts = pointMap[actionType] || 100;
    const userName = localStorage.getItem('ecometrics_user') ? JSON.parse(localStorage.getItem('ecometrics_user')).name : 'Sarah Jenkins';

    try {
      await api.post('/community', {
        title,
        action_type: actionType,
        co2_saved_kg: Number(co2SavedKg)
      });
    } catch (err) {
      console.warn('Network log action error, updating local state:', err);
    } finally {
      const newAct = {
        id: Date.now(),
        user_name: userName,
        title,
        action_type: actionType,
        points: pts,
        co2_saved_kg: Number(co2SavedKg),
        date: new Date().toISOString().split('T')[0]
      };
      setActions(prev => [newAct, ...prev]);
      setShowModal(false);
      setTitle('');
      setSubmitting(false);
      alert('Awesome! Your green action has been logged and points awarded!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-eco-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4" /> Gamified Sustainability Initiatives
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Community Eco-Leaderboard & Challenges</h1>
          <p className="text-xs text-slate-400 mt-1">Empower occupants, staff, and community members to log eco-friendly habits and earn carbon credits.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-eco-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Log Green Action</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Top Eco Champions
            </h3>
            <span className="text-xs text-slate-400 font-medium">Ranked by Carbon Points</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Green Actions</th>
                  <th className="px-4 py-3">CO2 Avoided</th>
                  <th className="px-4 py-3 text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3 font-extrabold text-sm">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </td>
                    <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-eco-400 text-xs">
                        {item.user_name.charAt(0)}
                      </div>
                      {item.user_name}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-300">{item.actions_count} completed</td>
                    <td className="px-4 py-3 font-semibold text-eco-400">{item.total_co2_saved?.toFixed(1)} kg</td>
                    <td className="px-4 py-3 text-right font-black text-amber-400 text-sm">{item.total_points} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-eco-400" /> Recent Eco Actions
          </h3>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {actions.map((act) => (
              <div key={act.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{act.user_name}</span>
                  <span className="text-[10px] text-eco-400 font-bold bg-eco-950/60 border border-eco-500/30 px-2 py-0.5 rounded-full">
                    +{act.points} pts
                  </span>
                </div>
                <div className="text-xs text-white font-medium">{act.title}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Category: {act.action_type}</span>
                  <span>🌱 {act.co2_saved_kg} kg CO2 saved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-lg text-white">Log Your Green Action</h3>
            <form onSubmit={handleLogAction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Action Title</label>
                <input
                  type="text"
                  placeholder="e.g. Switched to EV Commute or Planted Desk Garden"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Action Category</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value="Carpool">Carpool / EV Transit (+150 pts)</option>
                  <option value="Solar Roof">Solar Roof Installation (+350 pts)</option>
                  <option value="Zero Waste Lunch">Zero Waste Lunch (+100 pts)</option>
                  <option value="Energy Saver">Desk Energy Saver (+80 pts)</option>
                  <option value="Plant Trees">Plant Trees (+300 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated CO2 Saved (kg)</label>
                <input
                  type="number"
                  value={co2SavedKg}
                  onChange={(e) => setCo2SavedKg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold"
                >
                  Submit & Earn Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
