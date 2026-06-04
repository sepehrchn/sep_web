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
 * Returns user ID if authenticated, null otherwise.
 */
export async function validateAdminSession(
  db: D1Database,
  request: Request
): Promise<AuthResult> {
  const sessionId = getSessionFromRequest(request);
  
  if (!sessionId) {
    return { authenticated: false, error: "No session cookie" };
  }
  
  const userId = await validateSession(db, sessionId);
  
  if (!userId) {
    return { authenticated: false, error: "Invalid or expired session" };
  }
  
  return { authenticated: true, userId };
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
