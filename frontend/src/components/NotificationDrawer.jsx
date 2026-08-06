import React, { useState } from 'react';
import { X, Bell, AlertTriangle, Sparkles, CheckCircle2, Info, ArrowRight, ShieldAlert } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'HVAC Overtime Consumption Alert',
      time: '12 mins ago',
      desc: 'Chiller Unit #2 ran during non-operational hours (02:00 AM - 05:00 AM) drawing 180 kWh surplus.',
      badge: 'High Severity',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'AI Renewable Optimization Available',
      time: '1 hour ago',
      desc: 'Shift Building B baseline load to solar microgrid buffer between 1:00 PM - 4:00 PM to offset grid carbon intensity.',
      badge: 'AI Insight',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: Sparkles,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 3,
      type: 'system',
      title: 'Monthly Scope 1 & 2 Audit Verified',
      time: '3 hours ago',
      desc: 'Automated GHG Protocol verification passed with 99.4% confidence rating.',
      badge: 'Completed',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: CheckCircle2,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Restroom Water Line Pressure Drop',
      time: '5 hours ago',
      desc: 'Continuous flow rate of 42 L/min detected in East Wing during low-occupancy window.',
      badge: 'Medium Severity',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: ShieldAlert,
      iconBg: 'bg-amber-50 text-amber-600',
    },
    {
      id: 5,
      type: 'system',
      title: 'Gemini 1.5 Pro Model Synchronized',
      time: 'Yesterday',
      desc: 'Upgraded sustainability reasoning models for scenario simulations and ESG reporting.',
      badge: 'System Update',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: Info,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  const filtered = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Notifications & Alerts</h2>
                <p className="text-xs text-slate-500">Real-time AI telemetry feed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 px-5 pt-3 space-x-2 bg-white">
            {[
              { id: 'all', label: 'All (5)' },
              { id: 'alert', label: 'Alerts' },
              { id: 'recommendation', label: 'AI Advisor' },
              { id: 'system', label: 'System' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F7F9FC]">
            {filtered.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-glass hover:border-emerald-200 transition-all space-y-2 group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pl-12">
                    {item.desc}
                  </p>

                  <div className="pl-12 pt-1 flex items-center text-[11px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Resolution Blueprint</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
            <span>5 total notifications</span>
            <button className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              Mark all as read
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
