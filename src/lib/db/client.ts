/**
 * D1 database client wrapper for Cloudflare Workers.
 * Provides typed access to the D1 binding.
 */

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
  batch: <T = unknown>(statements: D1PreparedStatement[]) => Promise<T[]>;
  exec: (query: string) => Promise<D1ExecResult>;
};

export type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: () => Promise<D1Result>;
  all: <T = unknown>() => Promise<D1Result<T>>;
};

export type D1Result<T = unknown> = {
  success: boolean;
  results?: T[];
  error?: string;
  meta?: {
    duration?: number;
    last_row_id?: number;
    changes?: number;
    rows_read?: number;
    rows_written?: number;
  };
};

export type D1ExecResult = {
  count: number;
  duration: number;
};

export function getDb(env: any): D1Database {
  if (!env?.DB) {
    throw new Error("D1 binding not found. Ensure DB is configured in wrangler.toml");
  }
  return env.DB;
}
