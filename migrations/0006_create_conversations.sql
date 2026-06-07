CREATE TABLE IF NOT EXISTS conversations (
  id         TEXT    PRIMARY KEY,
  session_id TEXT    NOT NULL,
  role       TEXT    NOT NULL CHECK(role IN ('user', 'assistant')),
  content    TEXT    NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_conversations_session
  ON conversations(session_id);

CREATE INDEX IF NOT EXISTS idx_conversations_created
  ON conversations(created_at);
