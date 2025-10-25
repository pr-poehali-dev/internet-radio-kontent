-- Create table for track history
CREATE TABLE IF NOT EXISTS track_history (
    id SERIAL PRIMARY KEY,
    artist VARCHAR(500) NOT NULL,
    title VARCHAR(500) NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_track_time UNIQUE(artist, title, played_at)
);

-- Create index for faster queries
CREATE INDEX idx_played_at ON track_history(played_at DESC);

-- Add comment
COMMENT ON TABLE track_history IS 'History of played tracks from radio stream';