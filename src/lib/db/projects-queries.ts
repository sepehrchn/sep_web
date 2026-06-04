/**
 * Type-safe query utilities for projects table.
 */

import type { D1Database } from "./client";

export type Project = {
  id: number;
  url: string;
  bg_class: string;
  center_text: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  tags: string[];
  github: string;
  demo: string;
  screenshots?: { src: string; alt: string }[];
  display_order: number;
  is_visible: number;
  created_at: number;
  updated_at: number;
};

type ProjectRow = Omit<Project, "highlights" | "tags" | "screenshots"> & {
  highlights: string;
  tags: string;
  screenshots: string | null;
};

function parseProject(row: ProjectRow): Project {
  return {
    ...row,
    highlights: JSON.parse(row.highlights),
    tags: JSON.parse(row.tags),
    screenshots: row.screenshots ? JSON.parse(row.screenshots) : undefined,
  };
}

export async function getVisibleProjects(db: D1Database): Promise<Project[]> {
  const result = await db
    .prepare(
      `SELECT * FROM projects WHERE is_visible = 1 ORDER BY display_order ASC`
    )
    .all<ProjectRow>();

  return (result.results ?? []).map(parseProject);
}

export async function getAllProjects(db: D1Database): Promise<Project[]> {
  const result = await db
    .prepare(`SELECT * FROM projects ORDER BY display_order ASC`)
    .all<ProjectRow>();

  return (result.results ?? []).map(parseProject);
}

export async function getProjectById(
  db: D1Database,
  id: number
): Promise<Project | null> {
  const row = await db
    .prepare(`SELECT * FROM projects WHERE id = ?`)
    .bind(id)
    .first<ProjectRow>();

  return row ? parseProject(row) : null;
}
