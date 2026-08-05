import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EmissionsTracker from './pages/EmissionsTracker';
import AISustainabilityAdvisor from './pages/AISustainabilityAdvisor';
import ScenarioSimulator from './pages/ScenarioSimulator';
import ESGReports from './pages/ESGReports';
import CommunityLeaderboard from './pages/CommunityLeaderboard';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-eco-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/emissions" element={<EmissionsTracker />} />
            <Route path="/ai-advisor" element={<AISustainabilityAdvisor />} />
            <Route path="/simulator" element={<ScenarioSimulator />} />
            <Route path="/reports" element={<ESGReports />} />
            <Route path="/community" element={<CommunityLeaderboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
