/**
 * Protected route utilities for admin authentication.
 * Provides server-side route protection before components render.
 */

import { redirect } from "@tanstack/react-router";
import type { D1Database } from "./db/client";
import { validateAdminSession } from "./auth-middleware";

/**
 * Server-side route loader for protected admin routes.
 * Validates session BEFORE component rendering.
 * Redirects to login if not authenticated.
 */
export async function requireAdminAuth(
  db: D1Database,
  request: Request
): Promise<{ userId: number }> {
  const authResult = await validateAdminSession(db, request);

  if (!authResult.authenticated) {
    throw redirect({ to: "/admin/login" });
  }

  return { userId: authResult.userId };
}
