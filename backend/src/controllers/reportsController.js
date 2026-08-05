const { z } = require('zod');
const { getDB } = require('../config/db');

const reportSchema = z.object({
  title: z.string().min(3),
  reporting_period: z.string().min(2)
});

async function getReports(req, res) {
  try {
    const db = await getDB();
    const reports = await db.all('SELECT * FROM esg_reports ORDER BY id DESC');
    return res.json({ reports });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch ESG reports.' });
  }
}

async function createReport(req, res) {
  try {
    const db = await getDB();
    const { title, reporting_period } = req.body;

    const scopeTotals = await db.all(`
      SELECT scope, SUM(co2e_kg) as total_kg FROM emissions_logs GROUP BY scope
    `);

    let s1 = 0, s2 = 0, s3 = 0;
    scopeTotals.forEach(r => {
      if (r.scope === 'Scope 1') s1 = r.total_kg / 1000;
      if (r.scope === 'Scope 2') s2 = r.total_kg / 1000;
      if (r.scope === 'Scope 3') s3 = r.total_kg / 1000;
    });

    const total = Number((s1 + s2 + s3).toFixed(2));
    const esgScore = Math.min(98, Math.max(60, Math.round(100 - (total / 3))));

    const summary = `Generated ESG Executive Disclosure for ${reporting_period}. Portfolio emitted ${total} metric tonnes CO2e across Scope 1 (${s1.toFixed(2)}t), Scope 2 (${s2.toFixed(2)}t), and Scope 3 (${s3.toFixed(2)}t). Compliance score evaluated at ${esgScore}/100.`;

    const result = await db.run(`
      INSERT INTO esg_reports (title, reporting_period, scope1_total, scope2_total, scope3_total, total_co2e_tonnes, renewable_energy_pct, water_recycled_pct, waste_diverted_pct, esg_score, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, reporting_period, Number(s1.toFixed(2)), Number(s2.toFixed(2)), Number(s3.toFixed(2)), total, 42.5, 68.0, 74.2, esgScore, summary]);

    const report = await db.get('SELECT * FROM esg_reports WHERE id = ?', [result.lastID]);
    return res.status(201).json({ message: 'Report generated successfully', report });
  } catch (err) {
    console.error('Create report error:', err);
    return res.status(500).json({ message: 'Failed to generate ESG report.' });
  }
}

module.exports = {
  getReports,
  createReport,
  reportSchema
};
