-- Migration: Make email nullable on contacts table
-- Created: 2026-07-10

CREATE TABLE contacts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  project TEXT NOT NULL,
  budget TEXT,
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'in_progress', 'completed', 'archived')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO contacts_new (id, name, email, phone, company, project, budget, status, created_at, updated_at)
SELECT id, name, email, phone, company, project, budget, status, created_at, updated_at FROM contacts;

DROP TABLE contacts;
ALTER TABLE contacts_new RENAME TO contacts;

CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_email ON contacts(email);
