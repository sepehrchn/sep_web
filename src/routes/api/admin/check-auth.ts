import { createFileRoute } from "@tanstack/react-router";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";
import { validateAdminSession, createUnauthorizedResponse } from "@/lib/auth-middleware";

export const Route = createFileRoute("/api/admin/check-auth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const env = await getDevEnv();
          const db = getDb(env);
          const authResult = await validateAdminSession(db, request);

          if (!authResult.authenticated) {
            return createUnauthorizedResponse("Not authenticated");
          }

          return new Response(JSON.stringify({ authenticated: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          // Treat errors as unauthenticated
          console.error("Auth check error:", error);
          return new Response(JSON.stringify({ authenticated: false }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
