export async function logConversation(db, sessionId, userMessage, assistantReply) {
  const now = Date.now();
  await db.batch([
    db
      .prepare('INSERT INTO conversations (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), sessionId, 'user', userMessage, now),
    db
      .prepare('INSERT INTO conversations (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), sessionId, 'assistant', assistantReply, now),
  ]);
}

export default logConversation;
