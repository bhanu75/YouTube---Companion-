import express from 'express';
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

// GET /api/notes/:videoId - Get all notes for a video
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const result = await pool.query(
      'SELECT * FROM notes WHERE video_id = $1 ORDER BY created_at DESC',
      [videoId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notes/:videoId - Create a new note
router.post('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text, tags } = req.body;
    
    const result = await pool.query(
      'INSERT INTO notes (video_id, text, tags) VALUES ($1, $2, $3) RETURNING *',
      [videoId, text, tags || []]
    );
    
    await logEvent(videoId, 'ADD_NOTE', { text, tags });
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating note:', error);
    await logEvent(req.params.videoId, 'ERROR', { message: 'Failed to add note' });
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notes/:noteId - Update a note
router.put('/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    const { text, tags, videoId } = req.body;
    
    const result = await pool.query(
      'UPDATE notes SET text = $1, tags = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [text, tags || [], noteId]
    );
    
    await logEvent(videoId, 'UPDATE_NOTE', { noteId, text, tags });
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notes/:noteId - Delete a note
router.delete('/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    const { videoId } = req.query;
    
    await pool.query('DELETE FROM notes WHERE id = $1', [noteId]);
    
    await logEvent(videoId, 'DELETE_NOTE', { noteId });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    await logEvent(req.query.videoId, 'ERROR', { message: 'Failed to delete note' });
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/:videoId/search - Search notes
router.get('/:videoId/search', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { q, tag } = req.query;
    
    let query = 'SELECT * FROM notes WHERE video_id = $1';
    const params = [videoId];
    
    if (q) {
      query += ' AND to_tsvector(\'english\', text) @@ plainto_tsquery(\'english\', $2)';
      params.push(q);
    }
    
    if (tag) {
      const tagIndex = params.length + 1;
      query += ` AND $${tagIndex} = ANY(tags)`;
      params.push(tag);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
