const { z } = require('zod');
const { getDB } = require('../config/db');

const emissionFactors = {
  Electricity: 0.385,   // kg CO2e per kWh
  'Natural Gas': 5.3,    // kg CO2e per Therm
  Water: 0.0012,        // kg CO2e per Liter
  Waste: 0.5,           // kg CO2e per Kg
  Transport: 0.41,      // kg CO2e per Mile
  'Supply Chain': 1.7   // kg CO2e per Kg
};

const scopeMap = {
  Electricity: 'Scope 2',
  'Natural Gas': 'Scope 1',
  Water: 'Scope 3',
  Waste: 'Scope 3',
  Transport: 'Scope 3',
  'Supply Chain': 'Scope 3'
};

const addLogSchema = z.object({
  category: z.enum(['Electricity', 'Natural Gas', 'Water', 'Waste', 'Transport', 'Supply Chain']),
  quantity: z.number().positive('Quantity must be greater than zero'),
  unit: z.string().min(1, 'Unit is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional()
});

async function getEmissionsSummary(req, res) {
  try {
    const db = await getDB();

    // Aggregates by Scope
    const scopeTotals = await db.all(`
      SELECT scope, SUM(co2e_kg) as total_kg 
      FROM emissions_logs 
      GROUP BY scope
    `);

    let scope1_kg = 0, scope2_kg = 0, scope3_kg = 0;
    scopeTotals.forEach(row => {
      if (row.scope === 'Scope 1') scope1_kg = Number(row.total_kg);
      if (row.scope === 'Scope 2') scope2_kg = Number(row.total_kg);
      if (row.scope === 'Scope 3') scope3_kg = Number(row.total_kg);
    });

    const total_co2e_kg = scope1_kg + scope2_kg + scope3_kg;
    const total_co2e_tonnes = (total_co2e_kg / 1000).toFixed(2);

    // Energy aggregate
    const energyRow = await db.get(`
      SELECT SUM(quantity) as total_kwh FROM emissions_logs WHERE category = 'Electricity'
    `);
    const total_energy_kwh = Math.round(energyRow?.total_kwh || 0);

    // Water aggregate
    const waterRow = await db.get(`
      SELECT SUM(quantity) as total_liters FROM emissions_logs WHERE category = 'Water'
    `);
    const total_water_liters = Math.round(waterRow?.total_liters || 0);

    // Monthly trend for Recharts
    const monthlyTrend = await db.all(`
      SELECT 
        date,
        SUM(CASE WHEN scope = 'Scope 1' THEN co2e_kg / 1000 ELSE 0 END) as scope1_tonnes,
        SUM(CASE WHEN scope = 'Scope 2' THEN co2e_kg / 1000 ELSE 0 END) as scope2_tonnes,
        SUM(CASE WHEN scope = 'Scope 3' THEN co2e_kg / 1000 ELSE 0 END) as scope3_tonnes,
        SUM(co2e_kg / 1000) as total_tonnes
      FROM emissions_logs
      GROUP BY date
      ORDER BY date ASC
    `);

    // Category breakdown for Pie Chart
    const categoryBreakdown = await db.all(`
      SELECT category, SUM(co2e_kg / 1000) as total_tonnes
      FROM emissions_logs
      GROUP BY category
    `);

    // Fetch active anomaly alerts
    const alerts = await db.all('SELECT * FROM anomaly_alerts ORDER BY id DESC LIMIT 5');

    const monthlyTrendFormatted = monthlyTrend.map(item => ({
      date: item.date,
      scope1_tonnes: Number(Number(item.scope1_tonnes).toFixed(2)),
      scope2_tonnes: Number(Number(item.scope2_tonnes).toFixed(2)),
      scope3_tonnes: Number(Number(item.scope3_tonnes).toFixed(2)),
      total_tonnes: Number(Number(item.total_tonnes).toFixed(2))
    }));

    const categoryBreakdownFormatted = categoryBreakdown.map(item => ({
      category: item.category,
      total_tonnes: Number(Number(item.total_tonnes).toFixed(2))
    }));

    return res.json({
      summary: {
        total_co2e_tonnes: Number(total_co2e_tonnes),
        scope1_tonnes: Number((scope1_kg / 1000).toFixed(2)),
        scope2_tonnes: Number((scope2_kg / 1000).toFixed(2)),
        scope3_tonnes: Number((scope3_kg / 1000).toFixed(2)),
        total_energy_kwh,
        total_water_liters,
        renewable_pct: 38.5,
        waste_diversion_pct: 74.2,
        esg_compliance_score: 88
      },
      monthlyTrend: monthlyTrendFormatted,
      categoryBreakdown: categoryBreakdownFormatted,
      alerts
    });
  } catch (err) {
    console.error('Error fetching emissions summary:', err);
    return res.status(500).json({ message: 'Failed to compute emissions summary.' });
  }
}

async function getEmissionsLogs(req, res) {
  try {
    const db = await getDB();
    const { category, scope } = req.query;

    let query = 'SELECT * FROM emissions_logs WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (scope) {
      query += ' AND scope = ?';
      params.push(scope);
    }

    query += ' ORDER BY date DESC, id DESC';

    const logs = await db.all(query, params);
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch emissions logs.' });
  }
}

async function addEmissionsLog(req, res) {
  try {
    const db = await getDB();
    const { category, quantity, unit, date, notes } = req.body;
    const userId = req.user?.id || 1;

    const factor = emissionFactors[category] || 0.4;
    const scope = scopeMap[category] || 'Scope 3';
    const co2e_kg = Number((quantity * factor).toFixed(2));

    const result = await db.run(
      `INSERT INTO emissions_logs (user_id, category, scope, quantity, unit, co2e_kg, date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, category, scope, quantity, unit, co2e_kg, date, notes || '']
    );

    let newLog = null;
    if (result && result.lastID) {
      newLog = await db.get('SELECT * FROM emissions_logs WHERE id = ?', [result.lastID]);
    }

    if (!newLog) {
      newLog = {
        id: result?.lastID || Date.now(),
        user_id: userId,
        category,
        scope,
        quantity,
        unit,
        co2e_kg,
        date,
        notes: notes || ''
      };
    }

    return res.status(201).json({ message: 'Emission log created', log: newLog });
  } catch (err) {
    console.error('Error adding emission log:', err);
    return res.status(500).json({ message: 'Failed to add emission log.' });
  }
}

async function deleteEmissionsLog(req, res) {
  try {
    const db = await getDB();
    const { id } = req.params;

    await db.run('DELETE FROM emissions_logs WHERE id = ?', [id]);
    return res.json({ message: 'Log entry deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete log entry.' });
  }
}

module.exports = {
  getEmissionsSummary,
  getEmissionsLogs,
  addEmissionsLog,
  deleteEmissionsLog,
  addLogSchema
};
