/**
 * Type-safe query utilities for contacts table.
 */

import type { D1Database } from "./client";

export type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project: string;
  budget: string | null;
  status: "new" | "contacted" | "in_progress" | "completed" | "archived";
  created_at: number;
  updated_at: number;
};

export type NewContact = {
  name: string;
  email: string | null;
  phone: string;
  company?: string;
  project: string;
  budget?: string;
};

export async function insertContact(db: D1Database, data: NewContact): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO contacts (name, email, phone, company, project, budget) 
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(data.name, data.email || null, data.phone, data.company || null, data.project, data.budget || null)
    .run();

  if (!result.success) {
    throw new Error("Failed to insert contact");
  }

  return result.meta?.last_row_id ?? 0;
}

export async function getContacts(
  db: D1Database,
  limit = 50,
  offset = 0
): Promise<Contact[]> {
  const result = await db
    .prepare(`SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(limit, offset)
    .all<Contact>();

  return result.results ?? [];
}

export async function getContactById(db: D1Database, id: number): Promise<Contact | null> {
  return await db
    .prepare(`SELECT * FROM contacts WHERE id = ?`)
    .bind(id)
    .first<Contact>();
}

export async function updateContactStatus(
  db: D1Database,
  id: number,
  status: Contact["status"]
): Promise<void> {
  await db
    .prepare(`UPDATE contacts SET status = ?, updated_at = unixepoch() WHERE id = ?`)
    .bind(status, id)
    .run();
}
