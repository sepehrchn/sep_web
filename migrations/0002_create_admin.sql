-- Migration: Create admin authentication tables
-- Created: 2026-06-04

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  session_id TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  tab_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY(admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Admin user created - password hash should be set via secure initialization
-- DO NOT commit actual password hashes to version control
-- To set password: UPDATE admin_users SET password_hash = '<sha256-hash>' WHERE username = 'sepehr';
INSERT INTO admin_users (username, password_hash) 
VALUES ('sepehr', '');
