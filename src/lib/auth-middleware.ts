/**
 * Server-side authentication middleware for admin routes and APIs.
 * Validates admin sessions before allowing access to protected resources.
 */

import type { D1Database } from "./db/client";
import { validateSession } from "./auth";

export type AuthResult = 
  | { authenticated: true; userId: number }
  | { authenticated: false; error: string };

/**
 * Extract admin session cookie from request headers.
 */
export function getSessionFromRequest(request: Request): string | null {
  const cookies = request.headers.get("cookie");
  if (!cookies) return null;
  
  const sessionCookie = cookies
    .split(";")
    .find((c) => c.trim().startsWith("admin_session="));
  
  return sessionCookie?.split("=")[1] || null;
}

/**
 * Validate admin session from request headers.
 * Checks database for valid, non-expired session.
 */
export async function validateAdminSession(
  db: D1Database,
  request: Request
): Promise<AuthResult> {
  const sessionId = getSessionFromRequest(request);

  if (!sessionId) {
    return { authenticated: false, error: "No session cookie" };
  }

  // Require per-tab token header to ensure the session is used from the same tab
  const tabToken = request.headers.get("X-Admin-Tab") || undefined;
  if (!tabToken) {
    return { authenticated: false, error: "No tab token" };
  }

  try {
    const userId = await validateSession(db, sessionId, tabToken);
    if (userId) {
      return { authenticated: true, userId };
    }
    return { authenticated: false, error: "Session expired or invalid" };
  } catch (err) {
    console.error("Session validation error:", err);
    return { authenticated: false, error: "Session validation failed" };
  }
}

/**
 * Create a standardized 401 Unauthorized response.
 */
export function createUnauthorizedResponse(message = "Unauthorized"): Response {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}
