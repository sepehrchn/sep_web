import { createServerFn } from "@tanstack/react-start";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";
import { getSessionFromRequest, validateAdminSession } from "@/lib/auth-middleware";

export const checkAuth = createServerFn({ method: "GET" }).handler(
  async ({ request }) => {
    const env = await getDevEnv();
    const db = getDb(env);
    const authResult = await validateAdminSession(db, request);
    
    return { isAuthenticated: authResult.authenticated };
  }
);
