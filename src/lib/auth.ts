/**
 * Authentication utilities for admin panel.
 * Uses Web Crypto API for hashing (available in Cloudflare Workers).
 */

import type { D1Database } from "./db/client";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}

export function generateSessionId(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(
  db: D1Database,
  userId: number,
  tabToken?: string,
): Promise<string> {
  const sessionId = generateSessionId();
  // Short session lifetime (30 minutes) to enforce re-auth on browser close/inactivity
  const expiresAt = Math.floor(Date.now() / 1000) + 30 * 60; // 30 minutes

  await db
    .prepare(
      `INSERT INTO admin_sessions (id, user_id, expires_at, tab_token) VALUES (?, ?, ?, ?)`
    )
    .bind(sessionId, userId, expiresAt, tabToken ?? null)
    .run();

  return sessionId;
}

export async function validateSession(
  db: D1Database,
  sessionId: string,
  tabToken?: string,
): Promise<number | null> {
  if (!tabToken) return null; // require per-tab token for strong guarantees

  const session = await db
    .prepare(
      `SELECT user_id, expires_at FROM admin_sessions WHERE id = ? AND tab_token = ? AND expires_at > unixepoch()`
    )
    .bind(sessionId, tabToken)
    .first<{ user_id: number; expires_at: number }>();

  return session?.user_id ?? null;
}

export async function deleteSession(
  db: D1Database,
  sessionId: string
): Promise<void> {
  await db.prepare(`DELETE FROM admin_sessions WHERE id = ?`).bind(sessionId).run();
}
