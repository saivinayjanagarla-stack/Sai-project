const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

let dbInstance = null;

async function getDB() {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(__dirname, '../../database.sqlite');
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await dbInstance.exec('PRAGMA foreign_keys = ON;');
  await initTables(dbInstance);
  await seedInitialData(dbInstance);

  return dbInstance;
}

async function initTables(db) {
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Sustainability Officer',
      organization TEXT DEFAULT 'GreenCorp Tech Campus',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Emissions logs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS emissions_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL, -- Electricity, Natural Gas, Water, Waste, Transport, Supply Chain
      scope TEXT NOT NULL,    -- Scope 1, Scope 2, Scope 3
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,     -- kWh, Therms, Liters, Kg, Miles
      co2e_kg REAL NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Anomaly Alerts table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS anomaly_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      severity TEXT NOT NULL, -- Low, Medium, High, Critical
      detected_at TEXT NOT NULL,
      description TEXT NOT NULL,
      ai_recommendation TEXT NOT NULL,
      status TEXT DEFAULT 'Open' -- Open, Resolved, Investigating
    );
  `);

  // Retrofit Scenarios table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS retrofit_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      solar_pv_kw REAL DEFAULT 0,
      heat_pump_pct REAL DEFAULT 0,
      ev_fleet_pct REAL DEFAULT 0,
      hvac_ai_control INTEGER DEFAULT 0,
      led_lighting_pct REAL DEFAULT 0,
      projected_co2e_reduction REAL DEFAULT 0,
      estimated_capex REAL DEFAULT 0,
      payback_years REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // ESG Reports table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS esg_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      reporting_period TEXT NOT NULL,
      scope1_total REAL NOT NULL,
      scope2_total REAL NOT NULL,
      scope3_total REAL NOT NULL,
      total_co2e_tonnes REAL NOT NULL,
      renewable_energy_pct REAL NOT NULL,
      water_recycled_pct REAL NOT NULL,
      waste_diverted_pct REAL NOT NULL,
      esg_score INTEGER NOT NULL,
      summary TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Community Green Actions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      title TEXT NOT NULL,
      action_type TEXT NOT NULL, -- Carpool, Solar Roof, Zero Waste Lunch, Energy Saver, Plant Trees
      points INTEGER NOT NULL,
      co2_saved_kg REAL NOT NULL,
      date TEXT NOT NULL
    );
  `);
}

async function seedInitialData(db) {
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count > 0) return; // Already seeded

  console.log('🌱 Seeding initial Sustainability data into SQLite...');

  // Default demo user password: "password123"
  const hashedPassword = await bcrypt.hash('password123', 10);
  const result = await db.run(
    `INSERT INTO users (name, email, password, role, organization) VALUES (?, ?, ?, ?, ?)`,
    ['Sarah Jenkins', 'admin@ecometrics.ai', hashedPassword, 'Sustainability Officer', 'GreenCorp Tech Campus']
  );
  const userId = result.lastID;

  // Also seed a demo employee account
  await db.run(
    `INSERT INTO users (name, email, password, role, organization) VALUES (?, ?, ?, ?, ?)`,
    ['Alex Rivera', 'alex@greencorp.com', hashedPassword, 'Facility Auditor', 'GreenCorp Tech Campus']
  );

  // Seed realistic 6-month historical emissions data
  const sampleEmissions = [
    { category: 'Electricity', scope: 'Scope 2', quantity: 45000, unit: 'kWh', co2e_kg: 17325, date: '2026-03-01', notes: 'HVAC cooling tower load peak' },
    { category: 'Electricity', scope: 'Scope 2', quantity: 42000, unit: 'kWh', co2e_kg: 16170, date: '2026-04-01', notes: 'Smart thermostat trial started' },
    { category: 'Electricity', scope: 'Scope 2', quantity: 38500, unit: 'kWh', co2e_kg: 14822, date: '2026-05-01', notes: 'Rooftop solar solar panel Phase 1 active' },
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

  // Seed Anomaly Alerts
  await db.run(`
    INSERT INTO anomaly_alerts (title, category, severity, detected_at, description, ai_recommendation, status)
    VALUES 
    ('Overnight HVAC Idle Consumption Spike', 'Electricity', 'High', '2026-07-28 02:15 AM', 'Building B Chiller system drew 180 kWh between 2 AM and 5 AM on non-operational Sunday.', 'Audit BACnet schedule configuration; activate automatic night setback override control.', 'Open'),
    ('Water Supply Line Pressure Loss', 'Water', 'Medium', '2026-08-01 11:30 AM', 'Continuous flow of 42 L/min detected in East Wing restrooms during non-occupancy.', 'Deploy maintenance technician to inspect flushometers and main solenoid valve.', 'Investigating'),
    ('Sub-optimal Solar Inverter Clipping', 'Solar PV', 'Low', '2026-08-04 01:00 PM', 'Inverter #3 experiencing 8% power clipping during peak solar irradiance.', 'Reconfigure string cabling layout or add localized battery storage buffer.', 'Resolved')
  `);

  // Seed ESG Reports
  await db.run(`
    INSERT INTO esg_reports (title, reporting_period, scope1_total, scope2_total, scope3_total, total_co2e_tonnes, renewable_energy_pct, water_recycled_pct, waste_diverted_pct, esg_score, summary)
    VALUES 
    ('Q2 2026 Decarbonization & Environmental Performance Report', 'Q2 2026 (Apr - Jun)', 15.63, 44.47, 22.09, 82.19, 42.5, 68.0, 74.2, 88, 'GreenCorp achieved a 14.2% reduction in Scope 2 location-based electricity emissions following phase 1 rooftop solar installation. Waste diversion rate increased to 74.2% via composting and zero-single-use-plastic campus mandate.'),
    ('Q1 2026 Corporate GHG Emissions Audit', 'Q1 2026 (Jan - Mar)', 22.45, 52.80, 26.50, 101.75, 28.0, 52.0, 61.5, 79, 'Initial baseline measurement for facility portfolio under GHG Protocol Corporate Standard.')
  `);

  // Seed Community Actions
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

  console.log('✅ SQLite data seeding complete!');
}

module.exports = { getDB };
