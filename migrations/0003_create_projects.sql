-- Migration: Create projects table
-- Created: 2026-06-04

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  bg_class TEXT NOT NULL,
  center_text TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT NOT NULL, -- JSON array
  tags TEXT NOT NULL, -- JSON array
  github TEXT NOT NULL,
  demo TEXT NOT NULL,
  screenshots TEXT, -- JSON array
  display_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_projects_order ON projects(display_order, is_visible);
