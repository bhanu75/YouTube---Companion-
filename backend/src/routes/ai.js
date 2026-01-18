import express from 'express';
import { suggestTitleImprovements } from '../services/openai.js';
import { pool } from '../index.js';

const router = express.Router();

const logEvent = async (videoId, action, details) => {
  try {
    await pool.query(
      'INSERT INTO event_logs (video_id, action, details) VALUES ($1, $2, $3)',
      [videoId, action, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Error logging event:', error);
  }
};

// POST /api/ai/suggest-titles
router.post('/suggest-titles', async (req, res) => {
  try {
    const { title, description, videoId } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const suggestions = await suggestTitleImprovements(title, description || '');
    
    await logEvent(videoId, 'AI_SUGGEST_TITLES', { 
      originalTitle: title, 
      suggestions 
    });
    
    res.json({ suggestions });
  } catch (error) {
    console.error('Error generating title suggestions:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
