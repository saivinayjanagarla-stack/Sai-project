const { z } = require('zod');
const { getDB } = require('../config/db');

const simulationSchema = z.object({
  solar_pv_kw: z.number().min(0),
  heat_pump_pct: z.number().min(0).max(100),
  ev_fleet_pct: z.number().min(0).max(100),
  hvac_ai_control: z.boolean(),
  led_lighting_pct: z.number().min(0).max(100)
});

async function runSimulation(req, res) {
  try {
    const { solar_pv_kw, heat_pump_pct, ev_fleet_pct, hvac_ai_control, led_lighting_pct } = req.body;

    // Baseline stats: 100 tonnes CO2e baseline per month (1200 tonnes / year)
    const baselineAnnualTonnes = 1200;

    // Reductions
    const solarReductionTonnes = (solar_pv_kw * 1.35 * 365) / 1000 * 0.385; // kWh generated * emission factor
    const heatPumpReductionTonnes = (baselineAnnualTonnes * 0.20) * (heat_pump_pct / 100);
    const evReductionTonnes = (baselineAnnualTonnes * 0.12) * (ev_fleet_pct / 100);
    const hvacAiReductionTonnes = hvac_ai_control ? (baselineAnnualTonnes * 0.15) : 0;
    const ledReductionTonnes = (baselineAnnualTonnes * 0.08) * (led_lighting_pct / 100);

    const totalReductionTonnes = Math.min(
      baselineAnnualTonnes * 0.92,
      solarReductionTonnes + heatPumpReductionTonnes + evReductionTonnes + hvacAiReductionTonnes + ledReductionTonnes
    );

    const netEmissionsTonnes = Math.max(0, baselineAnnualTonnes - totalReductionTonnes);
    const reductionPercentage = Number(((totalReductionTonnes / baselineAnnualTonnes) * 100).toFixed(1));

    // CapEx calculation ($)
    const capexSolar = solar_pv_kw * 1200;
    const capexHeatPump = (heat_pump_pct / 100) * 85000;
    const capexEV = (ev_fleet_pct / 100) * 60000;
    const capexHvacAi = hvac_ai_control ? 15000 : 0;
    const capexLed = (led_lighting_pct / 100) * 12000;

    const totalCapex = Math.round(capexSolar + capexHeatPump + capexEV + capexHvacAi + capexLed);

    // Annual operational savings ($)
    const annualSavings = Math.round(totalReductionTonnes * 145 + (solar_pv_kw * 120));
    const paybackYears = annualSavings > 0 ? Number((totalCapex / annualSavings).toFixed(1)) : 0;

    // Build timeline projection (2026 to 2030)
    const currentYear = 2026;
    const timeline = [];
    for (let i = 0; i <= 4; i++) {
      const year = currentYear + i;
      const progressFactor = (i / 4);
      const projectedTonnes = Math.round(baselineAnnualTonnes - (totalReductionTonnes * progressFactor));
      timeline.push({
        year,
        baseline: baselineAnnualTonnes,
        projected: projectedTonnes,
        savingsUsd: Math.round(annualSavings * progressFactor)
      });
    }

    return res.json({
      simulation: {
        baselineAnnualTonnes,
        netEmissionsTonnes: Math.round(netEmissionsTonnes),
        totalReductionTonnes: Math.round(totalReductionTonnes),
        reductionPercentage,
        totalCapex,
        annualSavings,
        paybackYears,
        timeline,
        aiAssessment: `Combining ${solar_pv_kw} kW Solar PV with ${heat_pump_pct}% Heat Pump integration delivers a high-yield decarbonization path. Achieving a ${reductionPercentage}% annual emission drop positions your campus well ahead of 2030 SBTi Net-Zero targets.`
      }
    });
  } catch (err) {
    console.error('Simulation error:', err);
    return res.status(500).json({ message: 'Failed to run retrofit simulation.' });
  }
}

module.exports = {
  runSimulation,
  simulationSchema
};
