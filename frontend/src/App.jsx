import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationDrawer from './components/NotificationDrawer';
import Dashboard from './pages/Dashboard';
import EmissionsTracker from './pages/EmissionsTracker';
import AISustainabilityAdvisor from './pages/AISustainabilityAdvisor';
import ScenarioSimulator from './pages/ScenarioSimulator';
import ESGReports from './pages/ESGReports';
import CommunityLeaderboard from './pages/CommunityLeaderboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15, ease: 'easeIn' } }
};

function ProtectedLayout() {
  const { user, loading } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Initializing EcoMetrics AI Platform...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#111827] flex flex-col">
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} />
      
      <div className="flex flex-1 relative">
        <Sidebar />
        
        {/* Main Content Area with Framer Motion Page Transitions */}
        <main className="flex-1 p-4 md:p-6 md:pl-24 max-w-7xl mx-auto w-full transition-all overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="w-full"
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/emissions" element={<EmissionsTracker />} />
                <Route path="/ai-advisor" element={<AISustainabilityAdvisor />} />
                <Route path="/simulator" element={<ScenarioSimulator />} />
                <Route path="/reports" element={<ESGReports />} />
                <Route path="/community" element={<CommunityLeaderboard />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Notifications Slide-Out Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
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
