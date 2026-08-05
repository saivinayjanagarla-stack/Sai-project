const { z } = require('zod');
const { generateSustainabilityAudit, answerEcoChat } = require('../services/geminiService');

const auditSchema = z.object({
  category: z.string().min(1),
  scope: z.string().min(1),
  currentUsage: z.number().positive(),
  unit: z.string().min(1),
  buildingAreaSqFt: z.number().optional(),
  renewablePct: z.number().optional()
});

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  history: z.array(z.any()).optional()
});

async function runAudit(req, res) {
  try {
    const auditParams = req.body;
    const reportMarkdown = await generateSustainabilityAudit(auditParams);
    return res.json({ report: reportMarkdown });
  } catch (err) {
    console.error('Audit generation error:', err);
    return res.status(500).json({ message: 'Failed to generate AI sustainability audit.' });
  }
}

async function handleChat(req, res) {
  try {
    const { message, history } = req.body;
    const reply = await answerEcoChat(message, history || []);
    return res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    return res.status(500).json({ message: 'Failed to process AI chat response.' });
  }
}

module.exports = {
  runAudit,
  handleChat,
  auditSchema,
  chatSchema
};
