import { createFileRoute } from "@tanstack/react-router";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";
import { validateAdminSession, createUnauthorizedResponse } from "@/lib/auth-middleware";

export const Route = createFileRoute("/api/admin/conversations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const env = await getDevEnv();
        const db = getDb(env);
        const authResult = await validateAdminSession(db, request);

        if (!authResult.authenticated) {
          return createUnauthorizedResponse(authResult.error);
        }

        // Fetch recent session ids ordered by latest message
        const limit = 100;
        const sessionsRes = await db
          .prepare(
            `SELECT session_id, MAX(created_at) as last_at FROM conversations GROUP BY session_id ORDER BY last_at DESC LIMIT ?`
          )
          .bind(limit)
          .all();

        const sessions: Array<{ session_id: string; last_at: number; messages: any[] }> = [];

        const rows = sessionsRes.results || [];
        for (const r of rows) {
          const sessionId = r.session_id;
          const msgsRes = await db
            .prepare(`SELECT id, role, content, created_at FROM conversations WHERE session_id = ? ORDER BY created_at ASC`)
            .bind(sessionId)
            .all();

          sessions.push({
            session_id: sessionId,
            last_at: r.last_at,
            messages: msgsRes.results || [],
          });
        }

        return new Response(JSON.stringify({ sessions }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
