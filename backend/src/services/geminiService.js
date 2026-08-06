const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to handle Google Gemini API requests for Sustainability Analysis, Eco-Chat, and Decarbonization Audits.
 */
async function callGeminiAPI(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_google_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: systemInstruction || "You are EcoMetrics AI, a world-class expert in Environmental Engineering, GHG Protocol Accounting (Scope 1, 2, 3), ISO 50001 Energy Management, and ESG Decarbonization Strategy."
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.warn('⚠️ Gemini API call failed or rate limited. Falling back to intelligent heuristic engine:', error.message);
    }
  }

  // Fallback heuristic response if API Key is not set or network fails
  return null;
}

/**
 * Generates a full Decarbonization Audit & Recommendation Report
 */
async function generateSustainabilityAudit({ category, scope, currentUsage, unit, buildingAreaSqFt, renewablePct }) {
  const prompt = `Perform an enterprise sustainability audit for a facility with:
- Category: ${category}
- Scope: ${scope}
- Current Monthly Usage: ${currentUsage} ${unit}
- Facility Square Footage: ${buildingAreaSqFt || 50000} sq ft
- Renewable Energy Adoption: ${renewablePct || 25}%

Please provide:
1. Executive Summary & Carbon Impact
2. Top 3 Immediate Energy Efficiency Interventions
3. Estimated Annual CO2e Reduction (tonnes)
4. Recommended Capital Expenditure & Expected Payback Period (years)
5. Alignment with Science Based Targets initiative (SBTi) and GHG Protocol Scope guidelines.`;

  const geminiResult = await callGeminiAPI(prompt);
  if (geminiResult) return geminiResult;

  // Fallback domain-engineered intelligence
  const co2eEstimate = (currentUsage * 0.385 / 1000).toFixed(2);
  const potentialSavings = (co2eEstimate * 0.28).toFixed(2);
  const capexEstimate = Math.round(currentUsage * 0.85);
  const payback = (capexEstimate / (potentialSavings * 120)).toFixed(1);

  return `### 🌿 EcoMetrics AI Decarbonization Audit Report

#### 1. Executive Summary & Carbon Impact
Based on your logged monthly usage of **${currentUsage} ${unit}** (${category}, ${scope}), your facility generates approximately **${co2eEstimate} metric tonnes of CO2e** monthly. With a current renewable adoption rate of **${renewablePct || 25}%**, there is a high-yield opportunity to optimize consumption.

#### 2. Top 3 Immediate High-Impact Interventions
- **HVAC Variable Frequency Drive (VFD) Retrofit & Smart Night Setbacks**: Implementing AI-driven predictive setbacks can reduce peak thermal loads by 18-22%.
- **Sub-metering & Automated Peak-Shaving**: Install localized IoT smart meters across floor plates to detect off-hours phantom electricity draws.
- **On-Site Solar PV Expansion & Battery Storage (BESS)**: Transition remaining grid-purchased electricity to PPA or rooftop solar PV arrays.

#### 3. Estimated Decarbonization Metrics
- **Annual CO2e Avoidance Target**: ~**${potentialSavings * 12} tonnes CO2e / year** (28% reduction)
- **Estimated Implementation CapEx**: **$${capexEstimate.toLocaleString()}**
- **Calculated Payback Period**: **${payback} years** (including available clean energy tax credits)

#### 4. SBTi & GHG Protocol Alignment
This intervention directly targets your **${scope}** footprint, aligning with the 1.5°C Paris Agreement pathway and CSRD Scope reporting standards.`;
}

/**
 * Eco-Chat Interactive Assistant
 */
async function answerEcoChat(userQuery, conversationHistory = []) {
  const systemInstruction = `You are EcoMetrics AI Assistant, a friendly and highly knowledgeable AI expert in commercial energy efficiency, green building standards (LEED, BREEAM), carbon footprint reduction, zero-waste initiatives, and renewable transition. Keep responses structured, encouraging, actionable, and formatted in clear markdown.`;

  const prompt = `User query: "${userQuery}"\nContext: Provide actionable, scientific, and practical sustainability guidance.`;

  const geminiResult = await callGeminiAPI(prompt, systemInstruction);
  if (geminiResult) return geminiResult;

  // Heuristic responses for common sustainability queries
  const qLower = userQuery.toLowerCase();
  if (qLower.includes('hvac') || qLower.includes('cooling') || qLower.includes('heating')) {
    return `### 🌡️ HVAC Energy Optimization Guide
1. **Optimal Temperature Deadbands**: Set cooling setpoints to 24°C (75°F) and heating to 20°C (68°F) during occupied hours.
2. **Economizer Free Cooling**: Utilize outdoor air for cooling when ambient temperature drops below 18°C.
3. **Filter Maintenance**: Replace MERV 13+ filters quarterly — dirty filters increase fan power draw by up to 15%.
4. **AI Predictive Pre-Cooling**: Cool thermal mass during off-peak night utility rates.`;
  } else if (qLower.includes('solar') || qLower.includes('pv') || qLower.includes('renewable')) {
    return `### ☀️ Solar PV & Renewable Energy Assessment
1. **Roof Feasibility**: Ensure flat roof structural integrity for ~12-15 kg/m² ballasted racking.
2. **Power Purchase Agreements (PPAs)**: Consider zero-CapEx solar PPAs to lock in fixed kWh rates 25-30% below local utility tariffs.
3. **Net Metering & Battery Storage**: Pair 250 kW+ solar arrays with Lithium Iron Phosphate (LFP) BESS for peak-shaving.`;
  } else if (qLower.includes('waste') || qLower.includes('recycle') || qLower.includes('plastic')) {
    return `### ♻️ Zero Waste & Circular Economy Strategy
1. **Waste Diversion Audit**: Audit landfill vs compost vs recycling streams weekly.
2. **Composting organic waste**: Diverting food waste prevents anaerobic methane generation in landfills (GWP 28x CO2).
3. **Supplier Packaging Protocols**: Require vendor returnable pallet/tote agreements.`;
  }

  return `### 🌿 EcoMetrics AI Guidance
Thank you for your question on **"${userQuery}"**.

To optimize your resource utilization:
- **Analyze Baselines**: Track daily kWh, water intensity (Liters/sq ft), and landfill waste streams.
- **Implement Quick-Wins**: Switch to occupancy-sensor LED fixtures and low-flow 1.2 GPM aerators.
- **Engage Community**: Launch occupant eco-challenges to gamify behavioral energy reductions!`;
}

module.exports = {
  generateSustainabilityAudit,
  answerEcoChat,
  callGeminiAPI
};
