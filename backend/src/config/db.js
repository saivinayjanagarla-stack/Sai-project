const https = require('https');
const bcrypt = require('bcryptjs');
const { supabase } = require('./supabase');
require('dotenv').config();

const PAT = process.env.SUPABASE_PAT;
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'ztcjvywqufrlzshtafks';

let dbInstance = null;

/**
 * Execute raw SQL on Supabase PostgreSQL database
 */
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAT}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`Supabase SQL Error (HTTP ${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function escapeLiteral(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  const str = String(val);
  return "'" + str.replace(/'/g, "''") + "'";
}

function formatQuery(sql, params = []) {
  let paramIndex = 0;
  let formattedSql = sql.replace(/\?/g, () => {
    const val = params[paramIndex++];
    return escapeLiteral(val);
  });

  // Automatically append RETURNING id for INSERT queries if not already present
  if (/^\s*INSERT\s+INTO/i.test(formattedSql) && !/RETURNING/i.test(formattedSql)) {
    formattedSql += ' RETURNING id';
  }

  return formattedSql;
}

class SupabaseDBAdapter {
  async get(sql, params = []) {
    const formatted = formatQuery(sql, params);
    const rows = await executeSQL(formatted);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }

  async all(sql, params = []) {
    const formatted = formatQuery(sql, params);
    const rows = await executeSQL(formatted);
    return Array.isArray(rows) ? rows : [];
  }

  async run(sql, params = []) {
    const formatted = formatQuery(sql, params);
    const rows = await executeSQL(formatted);
    const lastID = (Array.isArray(rows) && rows.length > 0 && rows[0].id) ? rows[0].id : null;
    return { lastID, changes: Array.isArray(rows) ? rows.length : 1 };
  }

  async exec(sql) {
    return await executeSQL(sql);
  }
}

async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = new SupabaseDBAdapter();
  await initTables(dbInstance);
  await seedInitialData(dbInstance);

  return dbInstance;
}

async function initTables(db) {
  console.log('⚡ Ensuring Supabase PostgreSQL database tables exist...');
  const schemaSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Sustainability Officer',
      organization TEXT DEFAULT 'GreenCorp Tech Campus',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS emissions_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      scope TEXT NOT NULL,
      quantity NUMERIC NOT NULL,
      unit TEXT NOT NULL,
      co2e_kg NUMERIC NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS anomaly_alerts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      severity TEXT NOT NULL,
      detected_at TEXT NOT NULL,
      description TEXT NOT NULL,
      ai_recommendation TEXT NOT NULL,
      status TEXT DEFAULT 'Open'
    );

    CREATE TABLE IF NOT EXISTS retrofit_scenarios (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      solar_pv_kw NUMERIC DEFAULT 0,
      heat_pump_pct NUMERIC DEFAULT 0,
      ev_fleet_pct NUMERIC DEFAULT 0,
      hvac_ai_control INTEGER DEFAULT 0,
      led_lighting_pct NUMERIC DEFAULT 0,
      projected_co2e_reduction NUMERIC DEFAULT 0,
      estimated_capex NUMERIC DEFAULT 0,
      payback_years NUMERIC DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS esg_reports (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      reporting_period TEXT NOT NULL,
      scope1_total NUMERIC NOT NULL,
      scope2_total NUMERIC NOT NULL,
      scope3_total NUMERIC NOT NULL,
      total_co2e_tonnes NUMERIC NOT NULL,
      renewable_energy_pct NUMERIC NOT NULL,
      water_recycled_pct NUMERIC NOT NULL,
      waste_diverted_pct NUMERIC NOT NULL,
      esg_score INTEGER NOT NULL,
      summary TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS community_actions (
      id SERIAL PRIMARY KEY,
      user_name TEXT NOT NULL,
      title TEXT NOT NULL,
      action_type TEXT NOT NULL,
      points INTEGER NOT NULL,
      co2_saved_kg NUMERIC NOT NULL,
      date TEXT NOT NULL
    );
  `;

  await db.exec(schemaSQL);
}

async function seedInitialData(db) {
  // 1. Users Table
  const userCount = await db.get('SELECT COUNT(*)::int as count FROM users');
  let userId = 1;
  if (!userCount || userCount.count === 0) {
    console.log('🌱 Seeding initial Users into Supabase PostgreSQL...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const result = await db.run(
      `INSERT INTO users (name, email, password, role, organization) VALUES (?, ?, ?, ?, ?)`,
      ['Sarah Jenkins', 'admin@ecometrics.ai', hashedPassword, 'Sustainability Officer', 'GreenCorp Tech Campus']
    );
    userId = result.lastID || 1;

    await db.run(
      `INSERT INTO users (name, email, password, role, organization) VALUES (?, ?, ?, ?, ?)`,
      ['Alex Rivera', 'alex@greencorp.com', hashedPassword, 'Facility Auditor', 'GreenCorp Tech Campus']
    );
  } else {
    const existingUser = await db.get('SELECT id FROM users LIMIT 1');
    userId = existingUser?.id || 1;
  }

  // 2. Emissions Logs Table
  const logsCount = await db.get('SELECT COUNT(*)::int as count FROM emissions_logs');
  if (!logsCount || logsCount.count === 0) {
    console.log('🌱 Seeding initial Emissions Logs into Supabase PostgreSQL...');
    const sampleEmissions = [
      { category: 'Electricity', scope: 'Scope 2', quantity: 45000, unit: 'kWh', co2e_kg: 17325, date: '2026-03-01', notes: 'HVAC cooling tower load peak' },
      { category: 'Electricity', scope: 'Scope 2', quantity: 42000, unit: 'kWh', co2e_kg: 16170, date: '2026-04-01', notes: 'Smart thermostat trial started' },
      { category: 'Electricity', scope: 'Scope 2', quantity: 38500, unit: 'kWh', co2e_kg: 14822, date: '2026-05-01', notes: 'Rooftop solar panel Phase 1 active' },
      { category: 'Electricity', scope: 'Scope 2', quantity: 35000, unit: 'kWh', co2e_kg: 13475, date: '2026-06-01', notes: 'LED lighting retrofit completed' },
      { category: 'Electricity', scope: 'Scope 2', quantity: 33000, unit: 'kWh', co2e_kg: 12705, date: '2026-07-01', notes: 'HVAC AI setback optimization active' },

      { category: 'Natural Gas', scope: 'Scope 1', quantity: 1800, unit: 'Therms', co2e_kg: 9540, date: '2026-03-01', notes: 'Winter boiler heating' },
      { category: 'Natural Gas', scope: 'Scope 1', quantity: 1400, unit: 'Therms', co2e_kg: 7420, date: '2026-04-01', notes: 'Spring heating baseline' },
      { category: 'Natural Gas', scope: 'Scope 1', quantity: 900, unit: 'Therms', co2e_kg: 4770, date: '2026-05-01', notes: 'Domestic hot water only' },
      { category: 'Natural Gas', scope: 'Scope 1', quantity: 650, unit: 'Therms', co2e_kg: 3445, date: '2026-06-01', notes: 'Heat pump boiler hybrid system' },

      { category: 'Water', scope: 'Scope 3', quantity: 240000, unit: 'Liters', co2e_kg: 288, date: '2026-05-01', notes: 'Irrigation & cooling tower' },
      { category: 'Water', scope: 'Scope 3', quantity: 190000, unit: 'Liters', co2e_kg: 228, date: '2026-06-01', notes: 'Greywater recycling online' },

      { category: 'Waste', scope: 'Scope 3', quantity: 4200, unit: 'Kg', co2e_kg: 2100, date: '2026-06-15', notes: 'General landfill waste stream' },
      { category: 'Transport', scope: 'Scope 3', quantity: 12500, unit: 'Miles', co2e_kg: 5125, date: '2026-07-01', notes: 'Corporate shuttle & employee commuting' },
      { category: 'Supply Chain', scope: 'Scope 3', quantity: 8500, unit: 'Kg', co2e_kg: 14450, date: '2026-07-10', notes: 'IT hardware procurement paperless transition' }
    ];

    for (const item of sampleEmissions) {
      await db.run(
        `INSERT INTO emissions_logs (user_id, category, scope, quantity, unit, co2e_kg, date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, item.category, item.scope, item.quantity, item.unit, item.co2e_kg, item.date, item.notes]
      );
    }
  }

  // 3. Anomaly Alerts Table
  const alertsCount = await db.get('SELECT COUNT(*)::int as count FROM anomaly_alerts');
  if (!alertsCount || alertsCount.count === 0) {
    console.log('🌱 Seeding initial Anomaly Alerts into Supabase PostgreSQL...');
    await db.run(`
      INSERT INTO anomaly_alerts (title, category, severity, detected_at, description, ai_recommendation, status)
      VALUES 
      ('Overnight HVAC Idle Consumption Spike', 'Electricity', 'High', '2026-07-28 02:15 AM', 'Building B Chiller system drew 180 kWh between 2 AM and 5 AM on non-operational Sunday.', 'Audit BACnet schedule configuration; activate automatic night setback override control.', 'Open'),
      ('Water Supply Line Pressure Loss', 'Water', 'Medium', '2026-08-01 11:30 AM', 'Continuous flow of 42 L/min detected in East Wing restrooms during non-occupancy.', 'Deploy maintenance technician to inspect flushometers and main solenoid valve.', 'Investigating'),
      ('Sub-optimal Solar Inverter Clipping', 'Solar PV', 'Low', '2026-08-04 01:00 PM', 'Inverter #3 experiencing 8% power clipping during peak solar irradiance.', 'Reconfigure string cabling layout or add localized battery storage buffer.', 'Resolved')
    `);
  }

  // 4. Retrofit Scenarios Table
  const scenariosCount = await db.get('SELECT COUNT(*)::int as count FROM retrofit_scenarios');
  if (!scenariosCount || scenariosCount.count === 0) {
    console.log('🌱 Seeding initial Retrofit Scenarios into Supabase PostgreSQL...');
    await db.run(`
      INSERT INTO retrofit_scenarios (user_id, solar_pv_kw, heat_pump_pct, ev_fleet_pct, hvac_ai_control, led_lighting_pct, projected_co2e_reduction, estimated_capex, payback_years)
      VALUES (?, 150, 60, 40, 1, 85, 320, 245000, 3.8)
    `, [userId]);
  }

  // 5. ESG Reports Table
  const reportsCount = await db.get('SELECT COUNT(*)::int as count FROM esg_reports');
  if (!reportsCount || reportsCount.count === 0) {
    console.log('🌱 Seeding initial ESG Reports into Supabase PostgreSQL...');
    await db.run(`
      INSERT INTO esg_reports (title, reporting_period, scope1_total, scope2_total, scope3_total, total_co2e_tonnes, renewable_energy_pct, water_recycled_pct, waste_diverted_pct, esg_score, summary)
      VALUES 
      ('Q2 2026 Decarbonization & Environmental Performance Report', 'Q2 2026 (Apr - Jun)', 15.63, 44.47, 22.09, 82.19, 42.5, 68.0, 74.2, 88, 'GreenCorp achieved a 14.2% reduction in Scope 2 location-based electricity emissions following phase 1 rooftop solar installation. Waste diversion rate increased to 74.2% via composting and zero-single-use-plastic campus mandate.'),
      ('Q1 2026 Corporate GHG Emissions Audit', 'Q1 2026 (Jan - Mar)', 22.45, 52.80, 26.50, 101.75, 28.0, 52.0, 61.5, 79, 'Initial baseline measurement for facility portfolio under GHG Protocol Corporate Standard.')
    `);
  }

  // 6. Community Actions Table
  const communityCount = await db.get('SELECT COUNT(*)::int as count FROM community_actions');
  if (!communityCount || communityCount.count === 0) {
    console.log('🌱 Seeding initial Community Actions into Supabase PostgreSQL...');
    const communityData = [
      { user_name: 'Elena Rostova', title: 'Switched to EV Commute', action_type: 'Carpool', points: 150, co2_saved_kg: 42.5, date: '2026-08-02' },
      { user_name: 'David Chen', title: 'Installed Desk Solar Charger & Smart Strip', action_type: 'Energy Saver', points: 80, co2_saved_kg: 12.0, date: '2026-08-03' },
      { user_name: 'Priya Sharma', title: 'Zero Waste Campus Event Organizer', action_type: 'Zero Waste Lunch', points: 200, co2_saved_kg: 65.0, date: '2026-08-04' },
      { user_name: 'Marcus Vance', title: 'Planted 15 Native Micro-Forest Trees', action_type: 'Plant Trees', points: 300, co2_saved_kg: 180.0, date: '2026-08-05' }
    ];

    for (const act of communityData) {
      await db.run(
        `INSERT INTO community_actions (user_name, title, action_type, points, co2_saved_kg, date) VALUES (?, ?, ?, ?, ?, ?)`,
        [act.user_name, act.title, act.action_type, act.points, act.co2_saved_kg, act.date]
      );
    }
  }

  console.log('✅ Supabase database seeding complete!');
}

module.exports = { getDB };
