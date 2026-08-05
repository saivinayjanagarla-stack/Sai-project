import React, { useState } from 'react';
import { Bot, Sparkles, Send, FileText, Zap, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function AISustainabilityAdvisor() {
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' or 'chat'

  // Audit Form State
  const [category, setCategory] = useState('Electricity');
  const [scope, setScope] = useState('Scope 2');
  const [currentUsage, setCurrentUsage] = useState(45000);
  const [unit, setUnit] = useState('kWh');
  const [buildingAreaSqFt, setBuildingAreaSqFt] = useState(50000);
  const [renewablePct, setRenewablePct] = useState(25);
  const [auditResult, setAuditResult] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);

  // Chat Console State
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am **EcoMetrics Gemini AI**, your virtual Sustainability & Energy Engineering Advisor. How can I assist you with carbon accounting, ISO 50001 energy audits, or renewable transitions today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

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
      setAuditResult(res.data.report);
    } catch (err) {
      alert('Failed to generate AI Audit Report. Check backend connectivity.');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: query, history: newMessages });
      setMessages([...newMessages, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'ai', text: '⚠️ Apologies, I encountered an issue processing your query. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const quickPrompts = [
    'How do I optimize commercial HVAC chillers for 20% energy savings?',
    'What is the payback period for 250 kW solar PV with battery storage?',
    'How to track Scope 3 emissions for corporate supply chain procurement?',
    'What are the key steps for zero-waste campus certification?'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-eco-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Powered by Google Gemini AI
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">AI Decarbonization Advisor & Eco-Chat</h1>
          <p className="text-xs text-slate-400 mt-1">Generate facility-specific decarbonization plans or consult with our domain-trained AI Assistant.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-eco-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Decarbonization Audit
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-eco-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive Eco-Chat
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audit Input Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-eco-400" /> Audit Parameters
            </h3>

            <form onSubmit={handleGenerateAudit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resource Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value === 'Electricity') { setScope('Scope 2'); setUnit('kWh'); }
                    if (e.target.value === 'Natural Gas') { setScope('Scope 1'); setUnit('Therms'); }
                    if (e.target.value === 'Water') { setScope('Scope 3'); setUnit('Liters'); }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-eco-500"
                >
                  <option value="Electricity">Electricity (HVAC & Lighting)</option>
                  <option value="Natural Gas">Natural Gas (Boilers)</option>
                  <option value="Water">Water & Irrigation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Usage</label>
                  <input
                    type="number"
                    value={currentUsage}
                    onChange={(e) => setCurrentUsage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-eco-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    readOnly
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Facility Area (sq ft)</label>
                <input
                  type="number"
                  value={buildingAreaSqFt}
                  onChange={(e) => setBuildingAreaSqFt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-eco-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Renewable Energy Adoption (%)</label>
                <input
                  type="number"
                  value={renewablePct}
                  onChange={(e) => setRenewablePct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-eco-500"
                />
              </div>

              <button
                type="submit"
                disabled={auditLoading}
                className="w-full py-3 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-eco-500/20 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{auditLoading ? 'Analyzing via Gemini AI...' : 'Generate Decarbonization Plan'}</span>
              </button>
            </form>
          </div>

          {/* Audit Output View */}
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-eco-400" /> AI Decarbonization Strategy Output
              </h3>

              {auditLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <div className="w-10 h-10 border-4 border-eco-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-semibold text-slate-400">Gemini AI is generating your decarbonization roadmap...</p>
                </div>
              ) : auditResult ? (
                <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/80 p-5 rounded-xl border border-slate-800 max-h-[500px] overflow-y-auto">
                  {auditResult}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
                  <Bot className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-xs">Fill in your facility operational parameters on the left and click <strong>Generate Decarbonization Plan</strong>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Eco-Chat Console */
        <div className="glass-card rounded-2xl border border-slate-800 flex flex-col h-[650px] overflow-hidden">
          {/* Quick Prompt Chips */}
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0">Quick Prompts:</span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium shrink-0 border border-slate-700 transition-all hover:border-eco-500/40"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-eco-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="font-bold text-[10px] uppercase opacity-75 mb-1 flex items-center gap-1">
                    {msg.sender === 'user' ? 'Facility Manager' : 'EcoMetrics AI Advisor'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-eco-400 animate-ping"></div>
                  <span>EcoMetrics Gemini AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-3"
          >
            <input
              type="text"
              placeholder="Ask any sustainability, energy engineering, or ESG compliance question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-eco-500"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-5 py-3 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-eco-500/20 flex items-center space-x-1 disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
