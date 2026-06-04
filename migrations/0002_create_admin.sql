-- Migration: Create admin authentication tables
-- Created: 2026-06-04

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_expires ON admin_sessions(expires_at);

-- Insert default admin user (password: changeme123 - MUST be changed after first login)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '494a715f7e9b4071aca61bac42ca858a309524e5864f0920030862a4ae7589be');
