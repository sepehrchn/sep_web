import { createFileRoute } from "@tanstack/react-router";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";
import { deleteSession } from "@/lib/auth";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookies = request.headers.get("cookie");
        const sessionId = cookies
          ?.split(";")
          .find((c) => c.trim().startsWith("admin_session="))
          ?.split("=")[1];

        if (sessionId) {
          const env = await getDevEnv();
          const db = getDb(env);
          await deleteSession(db, sessionId);
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie":
              "admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
          },
        });
      },
    },
  },
});
