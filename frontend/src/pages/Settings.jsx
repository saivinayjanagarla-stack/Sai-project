import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Sun, 
  Bell, 
  Key, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  Check, 
  Copy, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Form States
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'sarah.jenkins@greencorp.com');
  const [role, setRole] = useState(user?.role || 'Chief Sustainability Officer');
  const [orgName, setOrgName] = useState('GreenCorp Tech Campus');
  const [taxId, setTaxId] = useState('US-948201948');
  const [headcount, setHeadcount] = useState('2,450');
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('emerald');
  const [apiKey, setApiKey] = useState('eco_live_948f29301948a72b01');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Toggle Switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const regenerateKey = () => {
    const newK = 'eco_live_' + Math.random().toString(36).substring(2, 18);
    setApiKey(newK);
  };

  const navTabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'appearance', label: 'Appearance & Theme', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'apikeys', label: 'API Keys & Integrations', icon: Key },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
    { id: 'devices', label: 'Connected IoT Meters', icon: Smartphone },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-glass">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Workspace Preferences</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">⚙️ Platform Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage user account profile, organization parameters, API integrations, and enterprise billing.</p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Notion Style Settings Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Settings Navigation Menu (3 columns) */}
        <div className="lg:col-span-3 glass-card-light p-3 rounded-3xl border border-slate-200/80 shadow-glass space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Preference Categories
          </div>

          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Settings Content Canvas (9 columns) */}
        <div className="lg:col-span-9 glass-card-light p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-glass space-y-6">
          
          {/* TAB 1: MY PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">User Profile Settings</h3>
                <p className="text-xs text-slate-500">Update your personal account identity and contact details.</p>
              </div>

              {/* Profile Card */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-500/20">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{role}</p>
                    <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      Enterprise Administrator
                    </span>
                  </div>
                </div>

                <button type="button" className="px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs shadow-2xs hover:bg-slate-100 transition-colors">
                  Change Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Work Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Job Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Timezone</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                    <option value="EST">(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option value="PST">(UTC-08:00) Pacific Time (US & Canada)</option>
                    <option value="UTC">(UTC+00:00) Universal Coordinated Time</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ORGANIZATION DETAILS */}
          {activeTab === 'organization' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Organization Parameters</h3>
                <p className="text-xs text-slate-500">Define facility portfolio structure and tax entity parameters.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Corporate Tax ID / EIN</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Total Employee Headcount</label>
                  <input
                    type="text"
                    value={headcount}
                    onChange={(e) => setHeadcount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Primary GHG Reporting Standard</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none">
                    <option value="GHG">GHG Protocol Corporate Accounting Standard</option>
                    <option value="ISO">ISO 14064-1 Quantification</option>
                    <option value="CSRD">CSRD European Sustainability Standard</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20"
                >
                  Save Organization Info
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: APPEARANCE & THEME */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Appearance & Glassmorphism Theme</h3>
                <p className="text-xs text-slate-500">Customize visual appearance, color palette, and component glass styling.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-700">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-3xl border text-center font-extrabold space-y-2 transition-all ${
                      theme === 'light'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto text-amber-500" />
                    <span className="block">Light Glass (Default)</span>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-3xl border text-center font-extrabold space-y-2 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white border-slate-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6 h-6 mx-auto rounded-full bg-slate-900 border border-slate-700" />
                    <span className="block">Dark Slate</span>
                  </button>

                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-3xl border text-center font-extrabold space-y-2 transition-all ${
                      theme === 'system'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Globe className="w-6 h-6 mx-auto text-blue-500" />
                    <span className="block">System Preference</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Notification Preferences</h3>
                <p className="text-xs text-slate-500">Choose when and how EcoMetrics AI notifies your team.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 block">Real-time Anomaly Alert Notifications</span>
                    <span className="text-[11px] text-slate-500">Immediate email when HVAC or water consumption spikes above baseline.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 block">Weekly Decarbonization Digest</span>
                    <span className="text-[11px] text-slate-500">Weekly PDF digest with Scope 1-3 metric summaries.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 block">Browser Push Notifications</span>
                    <span className="text-[11px] text-slate-500">Live desktop notifications when AI Copilot completes audit tasks.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={(e) => setPushNotifs(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: API KEYS */}
          {activeTab === 'apikeys' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">API Keys & IoT Developer Webhooks</h3>
                <p className="text-xs text-slate-500">Integrate BACnet IoT meters and ERP systems via REST API.</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <span className="font-extrabold text-slate-900 block">Active Secret API Key</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 font-mono text-slate-700 font-bold"
                  />
                  <button
                    onClick={copyApiKey}
                    className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 flex items-center space-x-1 shadow-2xs"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                  <button
                    onClick={regenerateKey}
                    className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700"
                    title="Regenerate Key"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Security & 2-Factor Authentication</h3>
                <p className="text-xs text-slate-500">Manage account credentials and two-factor authentication.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-slate-500">Authenticator App 2FA enabled for administrator access.</span>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 7: CONNECTED DEVICES */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Connected IoT Smart Meters</h3>
                <p className="text-xs text-slate-500">BACnet / Modbus telemetry hardware connections.</p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Chiller Unit #402 BACnet Meter', location: 'HQ Building A', status: 'Online 🟢' },
                  { name: 'Rooftop Solar PV Inverter #3', location: 'Research Lab B', status: 'Online 🟢' },
                  { name: 'East Wing Water Pressure Sensor', location: 'Campus East', status: 'Online 🟢' },
                ].map((dev, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-slate-900 block">{dev.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{dev.location}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {dev.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Billing & Enterprise Plan</h3>
                <p className="text-xs text-slate-500">Manage plan tier, payment method, and billing invoices.</p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white space-y-3 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Active Subscription</span>
                    <h4 className="text-xl font-black text-white">Enterprise AI SaaS Tier</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    Active
                  </span>
                </div>

                <div className="text-2xl font-black">$899 <span className="text-xs text-slate-300 font-normal">/ month (billed annually)</span></div>
                <p className="text-xs text-slate-300">Includes unlimited Scope 1-3 accounting, Gemini AI Copilot, and 50 IoT meter connections.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
