-- Database Schema for YouTube Companion

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    tags TEXT[], -- Array of tags for searching
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event logs table
CREATE TABLE IF NOT EXISTS event_logs (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_video_id ON notes(video_id);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_event_logs_video_id ON event_logs(video_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_timestamp ON event_logs(timestamp DESC);

-- Full text search index for notes
CREATE INDEX IF NOT EXISTS idx_notes_text_search ON notes USING GIN(to_tsvector('english', text));
