import React, { useState, useEffect } from 'react';
import { FileText, Download, Plus, CheckCircle2, ShieldCheck, Award, Calendar, Layers } from 'lucide-react';
import api from '../services/api';

export default function ESGReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportingPeriod, setReportingPeriod] = useState('Q3 2026 (Jul - Sep)');
  const [reportTitle, setReportTitle] = useState('Q3 2026 Executive Sustainability & Carbon Audit');

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error('Failed to fetch ESG reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await api.post('/reports', {
        title: reportTitle,
        reporting_period: reportingPeriod
      });
      fetchReports();
      alert('ESG Executive Disclosure Report successfully generated!');
    } catch (err) {
      alert('Failed to generate ESG report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (report) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ESG_Report_${report.reporting_period.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-eco-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Global Reporting Initiative & GHG Protocol
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">ESG & Compliance Disclosure Reports</h1>
          <p className="text-xs text-slate-400 mt-1">Audit-ready environmental reports formatted for CSRD, SEC, and Scope 1-3 corporate disclosures.</p>
        </div>

        <button
          onClick={() => {
            const period = prompt('Enter Reporting Period (e.g. Q3 2026):', 'Q3 2026');
            if (period) {
              setReportingPeriod(period);
              setReportTitle(`${period} Executive Sustainability Disclosure`);
            }
          }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-eco-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Audit Report</span>
        </button>
      </div>

      {/* Report Generation Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-eco-400" /> Generate Official Audit Summary
        </h3>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-eco-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reporting Period</label>
            <input
              type="text"
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-eco-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="py-2.5 rounded-xl bg-eco-500 hover:bg-eco-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-eco-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isGenerating ? 'Compiling Disclosure...' : 'Compile & Verify Report'}</span>
          </button>
        </form>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white">Archived Executive Disclosures</h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading compiled ESG reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 border border-slate-800 rounded-2xl">
            No compiled ESG reports found. Compile your first report above.
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-eco-400 bg-eco-950/60 border border-eco-500/30 px-2.5 py-1 rounded-full">
                    {report.reporting_period}
                  </span>
                  <h4 className="font-bold text-lg text-white mt-2">{report.title}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <Calendar className="w-3.5 h-3.5" /> Compiled on {report.created_at || '2026-08-05'}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400">ESG Score</div>
                    <div className="text-xl font-black text-amber-400">{report.esg_score} / 100</div>
                  </div>

                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
                    title="Export JSON JSON/PDF"
                  >
                    <Download className="w-4 h-4 text-eco-400" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Emissions Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Total CO2e</span>
                  <div className="font-black text-white text-base mt-0.5">{report.total_co2e_tonnes} tonnes</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Scope 1 (Gas)</span>
                  <div className="font-bold text-rose-400 text-sm mt-0.5">{report.scope1_total} tonnes</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Scope 2 (Electricity)</span>
                  <div className="font-bold text-blue-400 text-sm mt-0.5">{report.scope2_total} tonnes</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] font-bold uppercase">Scope 3 (Value Chain)</span>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">{report.scope3_total} tonnes</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong>Executive Summary:</strong> {report.summary}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
