import express from 'express';
import { getComments, addComment, replyToComment, deleteComment, setCredentials } from '../services/youtube.js';
import { pool } from '../index.js';

const router = express.Router();

// Middleware to set YouTube credentials
router.use((req, res, next) => {
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

// GET /api/comments/:videoId
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await getComments(videoId);
    
    await logEvent(videoId, 'LOAD_COMMENTS', { count: comments.length });
    
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/comments/:videoId
router.post('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    
    const comment = await addComment(videoId, text);
    
    await logEvent(videoId, 'ADD_COMMENT', { text });
    
    res.json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    await logEvent(req.params.videoId, 'ERROR', { message: 'Failed to add comment' });
    res.status(500).json({ error: error.message });
  }
});

// POST /api/comments/:commentId/reply
router.post('/:commentId/reply', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, videoId } = req.body;
    
    const reply = await replyToComment(commentId, text);
    
    await logEvent(videoId, 'REPLY_TO_COMMENT', { commentId, text });
    
    res.json(reply);
  } catch (error) {
    console.error('Error replying to comment:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/comments/:commentId
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { videoId } = req.query;
    
    await deleteComment(commentId);
    
    await logEvent(videoId, 'DELETE_COMMENT', { commentId });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    await logEvent(req.query.videoId, 'ERROR', { message: 'Failed to delete comment' });
    res.status(500).json({ error: error.message });
  }
});

export default router;
