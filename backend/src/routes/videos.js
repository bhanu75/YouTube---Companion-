import express from 'express';
import { getVideoDetails, updateVideo, setCredentials } from '../services/youtube.js';
import { pool } from '../index.js';

const router = express.Router();

// Middleware to set YouTube credentials (you'll need to handle auth)
router.use((req, res, next) => {
  // In production, get these from session/database
  const tokens = req.headers.authorization?.split(' ')[1];
  if (tokens) {
    try {
      setCredentials(JSON.parse(Buffer.from(tokens, 'base64').toString()));
    } catch (error) {
      console.error('Error setting credentials:', error);
    }
  }
  next();
});

// Log event helper
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

// GET /api/videos/:videoId
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await getVideoDetails(videoId);
    
    await logEvent(videoId, 'LOAD_VIDEO', { title: video.title });
    
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    await logEvent(req.params.videoId, 'ERROR', { message: 'Failed to load video' });
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/videos/:videoId
router.put('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    
    const result = await updateVideo(videoId, title, description);
    
    await logEvent(videoId, 'UPDATE_VIDEO', { title, description });
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating video:', error);
    await logEvent(req.params.videoId, 'ERROR', { message: 'Failed to update video' });
    res.status(500).json({ error: error.message });
  }
});

export default router;
