const { z } = require('zod');
const { getDB } = require('../config/db');

const actionSchema = z.object({
  title: z.string().min(3),
  action_type: z.enum(['Carpool', 'Solar Roof', 'Zero Waste Lunch', 'Energy Saver', 'Plant Trees']),
  co2_saved_kg: z.number().positive()
});

async function getCommunityFeed(req, res) {
  try {
    const db = await getDB();
    const actions = await db.all('SELECT * FROM community_actions ORDER BY date DESC, id DESC LIMIT 20');

    // Aggregate Leaderboard rankings
    const leaderboard = await db.all(`
      SELECT 
        user_name,
        SUM(points) as total_points,
        SUM(co2_saved_kg) as total_co2_saved,
        COUNT(id) as actions_count
      FROM community_actions
      GROUP BY user_name
      ORDER BY total_points DESC
    `);

    return res.json({ actions, leaderboard });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch community feed.' });
  }
}

async function logAction(req, res) {
  try {
    const db = await getDB();
    const { title, action_type, co2_saved_kg } = req.body;
    const userName = req.user.name;

    const pointMap = {
      'Carpool': 150,
      'Solar Roof': 350,
      'Zero Waste Lunch': 100,
      'Energy Saver': 80,
      'Plant Trees': 300
    };
    const points = pointMap[action_type] || 100;
    const today = new Date().toISOString().split('T')[0];

    const result = await db.run(`
      INSERT INTO community_actions (user_name, title, action_type, points, co2_saved_kg, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userName, title, action_type, points, co2_saved_kg, today]);

    const newAction = await db.get('SELECT * FROM community_actions WHERE id = ?', [result.lastID]);
    return res.status(201).json({ message: 'Community action logged successfully', action: newAction });
  } catch (err) {
    console.error('Community action error:', err);
    return res.status(500).json({ message: 'Failed to log community action.' });
  }
}

module.exports = {
  getCommunityFeed,
  logAction,
  actionSchema
};
