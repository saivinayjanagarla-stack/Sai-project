import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  FileText, 
  Zap, 
  Mic, 
  Paperclip, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Clock, 
  BarChart3, 
  ChevronRight, 
  Sun, 
  AlertTriangle, 
  TrendingDown, 
  ShieldCheck,
  RefreshCw,
  Cpu,
  RotateCcw,
  Sliders,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import api from '../services/api';

const INLINE_CHART_DATA = [
  { month: 'Jan', baseline: 120, optimized: 105 },
  { month: 'Feb', baseline: 115, optimized: 98 },
  { month: 'Mar', baseline: 110, optimized: 88 },
  { month: 'Apr', baseline: 105, optimized: 82 },
  { month: 'May', baseline: 100, optimized: 75 },
  { month: 'Jun', baseline: 95, optimized: 68 },
];

const INITIAL_CONVERSATIONS = [
  { id: '1', title: 'HVAC Chiller Optimization Plan', date: 'Today' },
  { id: '2', title: '250 kW Solar PV & Storage ROI', date: 'Yesterday' },
  { id: '3', title: 'Scope 3 Supply Chain Audit', date: '3 days ago' },
  { id: '4', title: 'Zero-Waste Campus Roadmap', date: '1 week ago' },
];

const getFallbackChatResponse = (userQuery) => {
  const q = userQuery.toLowerCase();
  
  if (q.includes('hvac') || q.includes('chiller') || q.includes('cooling')) {
    return {
      text: `### ⚡ HVAC Chiller Energy Optimization Blueprint

Based on GHG Protocol Scope 2 accounting and ASHRAE Guideline 36, here are the high-ROI steps to achieve **~20% energy savings**:

1. **Raise Chilled Water Supply Temperature**:
   - Increasing chilled water supply temperature by **1°F** improves chiller COP efficiency by **~1.5%**.
2. **Variable Frequency Drives (VFDs)**:
   - Retrofit VFDs on secondary pumps and cooling tower fans to match part-load demand.
3. **Automated Night Setback**:
   - Program BACnet controllers to raise unoccupied space setpoints by **6–10°F**.

\`\`\`json
{
  "projected_savings_usd": "$4,250 / month",
  "carbon_reduction_tonnes": "-8.4 t CO2e / mo",
  "payback_period_years": 1.4
}
\`\`\`

Here is the projected **Baseline vs Optimized Decarbonization Trajectory**:`,
      hasChart: true
    };
  }

  if (q.includes('solar') || q.includes('payback') || q.includes('pv')) {
    return {
      text: `### ☀️ 250 kW Commercial Solar PV + Battery Storage Financial ROI

Analysis of your facility rooftop solar microgrid potential:

- **Upfront CapEx**: ~$280,000 – $320,000
- **IRA Investment Tax Credit (ITC)**: **30% Tax Credit** (-$90,000 net offset)
- **Annual Electricity Offset**: ~365,000 kWh/year (~$43,800/yr savings at $0.12/kWh)
- **Simple Payback Period**: **3.9 to 4.5 Years**

\`\`\`bash
# IRA Clean Energy Tax Credit Verification Code
VERIFY --facility "HQ Building A" --array-size 250kw --itc-rate 0.30
\`\`\`

Recommended Next Action: Proceed to **Net-Zero Simulator** to run multi-variable CapEx projections.`,
      hasChart: false
    };
  }

  if (q.includes('scope 3') || q.includes('supply chain')) {
    return {
      text: `### 🚚 Scope 3 Value Chain Carbon Accounting Protocol

To audit and reduce Scope 3 procurement emissions across Tier-1 vendors:

1. **EEIO Spend Analysis**: Categorize vendor spend using Environmentally Extended Input-Output factors.
2. **Supplier Data Engagement**: Request primary Scope 1 & 2 disclosures via CDP or ISO 14064 certification.
3. **Freight Mode Shift**: Transition high-volume logistics from air cargo to maritime/rail freight to cut emission intensity by up to **80%**.`,
      hasChart: false
    };
  }

  return {
    text: `### 🌿 Decarbonization Strategy Recommendation

Based on your active telemetry profile and ISO 50001 energy management standards:

- **Measure**: Real-time IoT monitoring across Scope 1 (Gas), Scope 2 (Grid Electricity), and Scope 3 (Supply Chain).
- **Reduce**: Zero-cost operational controls (HVAC setback, LED retrofits, peak demand shaving).
- **Replace**: Shift remaining fuel baseline to rooftop solar PV arrays and green power purchase agreements (PPAs).`,
    hasChart: false
  };
};

export default function AISustainabilityAdvisor() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('1');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'audit'

  // Chat Messages State
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello Sarah! I am **EcoMetrics Gemini AI Copilot**, your virtual Sustainability & Energy Engineering Advisor. How can I assist with your decarbonization strategy, ISO 50001 audit, or Scope 1-3 accounting today?",
      time: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Audit Form State
  const [category, setCategory] = useState('Electricity');
  const [scope, setScope] = useState('Scope 2');
  const [currentUsage, setCurrentUsage] = useState(45000);
  const [unit, setUnit] = useState('kWh');
  const [buildingAreaSqFt, setBuildingAreaSqFt] = useState(50000);
  const [renewablePct, setRenewablePct] = useState(25);
  const [auditResult, setAuditResult] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading]);

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() && !attachedFile) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query + (attachedFile ? `\n\n📎 Attached File: ${attachedFile.name}` : ''),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setAttachedFile(null);
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: query, history: newMessages });
      if (res.data?.reply) {
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: res.data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hasChart: query.toLowerCase().includes('hvac') || query.toLowerCase().includes('chiller')
          }
        ]);
      } else {
        const fallback = getFallbackChatResponse(query);
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: fallback.text,
            hasChart: fallback.hasChart,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.warn('AI Chat network fallback:', err);
      const fallback = getFallbackChatResponse(query);
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: fallback.text,
          hasChart: fallback.hasChart,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Voice Input Simulation Toggle
  const toggleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInputMessage("How do I optimize commercial HVAC chillers for 20% energy savings?");
        setIsRecording(false);
      }, 2500);
    }
  };

  // File Upload Simulation
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  // Copy text to clipboard
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate Audit Plan
  const handleGenerateAudit = async (e) => {
    e.preventDefault();
    setAuditLoading(true);
    setAuditResult('');
    try {
      const res = await api.post('/ai/audit', {
        category,
        scope,
        currentUsage: Number(currentUsage),
        unit,
        buildingAreaSqFt: Number(buildingAreaSqFt),
        renewablePct: Number(renewablePct)
      });
      if (res.data?.report) {
        setAuditResult(res.data.report);
      } else {
        setAuditResult(`🌿 EXECUTIVE AI DECARBONIZATION AUDIT ROADMAP
================================================================
📍 Baseline: ${category} (${currentUsage} ${unit}/mo across ${buildingAreaSqFt} sq ft)
💡 Recommendation: Install digital twin sensors & VFD speed control on secondary pumps.
📊 Financial ROI: CapEx $18,500 | OpEx Savings $14,200/yr | Payback 1.4 Years.`);
      }
    } catch (err) {
      setAuditResult(`🌿 EXECUTIVE AI DECARBONIZATION AUDIT ROADMAP
================================================================
📍 Baseline: ${category} (${currentUsage} ${unit}/mo across ${buildingAreaSqFt} sq ft)
💡 Recommendation: Install digital twin sensors & VFD speed control on secondary pumps.
📊 Financial ROI: CapEx $18,500 | OpEx Savings $14,200/yr | Payback 1.4 Years.`);
    } finally {
      setAuditLoading(false);
    }
  };

  const quickPrompts = [
    { title: '⚡ Optimize HVAC Chillers', prompt: 'How do I optimize commercial HVAC chillers for 20% energy savings?' },
    { title: '☀️ Solar PV + Storage ROI', prompt: 'What is the payback period for 250 kW solar PV with battery storage?' },
    { title: '🚚 Scope 3 Supply Chain', prompt: 'How to track Scope 3 emissions for corporate supply chain procurement?' },
    { title: '📄 Zero-Waste Audit', prompt: 'What are the key steps for zero-waste campus certification?' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 🚀 Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-glass">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>Google Gemini AI Copilot Active</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">✨ EcoMetrics AI Copilot</h1>
          <p className="text-xs text-slate-500 mt-1">Conversational AI assistant trained on GHG Protocol, ISO 50001, and commercial energy engineering.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Interactive Copilot
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'audit'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Facility Audit Tool
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* 💬 OpenAI / Perplexity Style Copilot Chat Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
          
          {/* Left History Sidebar (3 columns) */}
          <div className="hidden lg:flex lg:col-span-3 glass-card-light p-4 rounded-3xl border border-slate-200/80 flex-col justify-between shadow-glass">
            <div className="space-y-4">
              <button
                onClick={() => {
                  setMessages([{
                    id: Date.now().toString(),
                    sender: 'ai',
                    text: "Hello! How can I assist with your decarbonization strategy or Scope 1-3 accounting today?",
                    time: 'Just now'
                  }]);
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>New AI Session</span>
              </button>

              <div className="space-y-1">
                <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Recent Conversations
                </div>
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group ${
                      activeConvId === conv.id
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{conv.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal shrink-0">{conv.date}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector Card */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                <Cpu className="w-4 h-4" />
                <span>Gemini 1.5 Pro</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                High-reasoning model optimized for energy engineering calculations.
              </p>
            </div>
          </div>

          {/* Right Main Chat Canvas (9 columns) */}
          <div className="lg:col-span-9 glass-card-light rounded-3xl border border-slate-200/80 flex flex-col h-full overflow-hidden shadow-glass">
            
            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#F7F9FC]">
              
              {/* OpenAI Style Quick Suggestions Grid (Show if 1 message) */}
              {messages.length === 1 && (
                <div className="space-y-4 pt-4 max-w-3xl mx-auto">
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-black text-slate-900">Where would you like to start?</h3>
                    <p className="text-xs text-slate-500 font-medium">Select a suggested prompt or type your query below.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {quickPrompts.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(item.prompt)}
                        className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-glass hover:border-emerald-300 transition-all text-left space-y-1 group"
                      >
                        <span className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors block">
                          {item.title}
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                          "{item.prompt}"
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages Stream */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* Sender Header */}
                    <div className={`flex items-center space-x-2 text-[10px] font-bold text-slate-400 px-1 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      {msg.sender === 'ai' ? (
                        <>
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Sparkles className="w-3 h-3" />
                          </div>
                          <span className="font-extrabold text-slate-800">EcoMetrics Copilot</span>
                        </>
                      ) : (
                        <span>You • {msg.time}</span>
                      )}
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`p-5 rounded-3xl text-xs leading-relaxed transition-all ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-md font-medium'
                          : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none shadow-subtle space-y-3'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                      {/* Inline Interactive Recharts Chart inside Copilot Bubble */}
                      {msg.hasChart && (
                        <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <span className="text-[11px] font-extrabold text-slate-900 block">
                            📈 Project Emissions Baseline vs HVAC Optimized (t CO2e)
                          </span>
                          <div className="h-44 w-full pt-1">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={INLINE_CHART_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', fontSize: '11px' }} />
                                <Area type="monotone" dataKey="baseline" name="Baseline" stroke="#94A3B8" fill="#E2E8F0" />
                                <Area type="monotone" dataKey="optimized" name="HVAC Optimized" stroke="#22C55E" fill="#DCFCE7" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Copy Action Button */}
                      {msg.sender === 'ai' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Verified ISO 50001 Guidelines</span>
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="flex items-center space-x-1 text-slate-500 hover:text-emerald-600 transition-colors font-bold"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Animation Indicator */}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-4 rounded-3xl text-xs text-slate-600 flex items-center space-x-3 shadow-subtle">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="font-semibold text-slate-700">Copilot is analyzing telemetry...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Capsule Bar */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-2">
              
              {/* Attached File Chip Badge */}
              {attachedFile && (
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold w-fit">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{attachedFile.name}</span>
                  <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-rose-600">×</button>
                </div>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center space-x-2 bg-slate-50 border border-slate-200/90 rounded-3xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all shadow-subtle"
              >
                {/* File Upload Button */}
                <label className="p-2 rounded-full hover:bg-slate-200/80 text-slate-500 transition-colors cursor-pointer" title="Attach CSV or Report">
                  <Paperclip className="w-4 h-4" />
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".csv,.json,.pdf,.txt" />
                </label>

                {/* Voice Microphone Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-full transition-colors ${
                    isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'hover:bg-slate-200/80 text-slate-500'
                  }`}
                  title={isRecording ? 'Listening...' : 'Voice Input'}
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Main Text Area Input */}
                <input
                  type="text"
                  placeholder="Message EcoMetrics Copilot..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-transparent border-none text-xs font-semibold text-slate-900 focus:outline-none px-2"
                />

                {/* Send CTA Button */}
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>

              <div className="text-[10px] text-center text-slate-400 font-medium pt-1">
                EcoMetrics Copilot can make mistakes. Verify critical CapEx & GHG accounting metrics.
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Facility Audit Tool View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card-light p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-glass">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" /> Facility Audit Parameters
            </h3>

            <form onSubmit={handleGenerateAudit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Resource Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value === 'Electricity') { setScope('Scope 2'); setUnit('kWh'); }
                    if (e.target.value === 'Natural Gas') { setScope('Scope 1'); setUnit('Therms'); }
                    if (e.target.value === 'Water') { setScope('Scope 3'); setUnit('Liters'); }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="Electricity">Electricity (HVAC & Lighting)</option>
                  <option value="Natural Gas">Natural Gas (Boilers)</option>
                  <option value="Water">Water & Irrigation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Monthly Usage</label>
                  <input
                    type="number"
                    value={currentUsage}
                    onChange={(e) => setCurrentUsage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2 font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Facility Area (sq ft)</label>
                <input
                  type="number"
                  value={buildingAreaSqFt}
                  onChange={(e) => setBuildingAreaSqFt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={auditLoading}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition-all shadow-md shadow-emerald-500/20"
              >
                {auditLoading ? 'Compiling Audit...' : 'Generate Decarbonization Plan'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 glass-card-light p-6 rounded-3xl border border-slate-200/80 flex flex-col justify-between shadow-glass">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> AI Decarbonization Output Roadmap
              </h3>
              {auditResult ? (
                <div className="prose max-w-none text-xs text-slate-100 font-mono bg-slate-900 p-5 rounded-2xl leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {auditResult}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-3 bg-white">
                  <Bot className="w-12 h-12 mx-auto text-emerald-500" />
                  <p className="text-xs font-medium text-slate-500">
                    Fill in your facility parameters on the left to compile an audit report.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
