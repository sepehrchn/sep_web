import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";
import { validateSession } from "@/lib/auth";
import { updateContactStatus } from "@/lib/db/queries";

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "in_progress", "completed", "archived"]),
});

export const Route = createFileRoute("/api/admin/contacts/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, context, params }) => {
        // Auth check
        const cookies = request.headers.get("cookie");
        const sessionId = cookies
          ?.split(";")
          .find((c) => c.trim().startsWith("admin_session="))
          ?.split("=")[1];

        if (!sessionId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const env = await getDevEnv();
        const db = getDb(env);
        const userId = await validateSession(db, sessionId);

        if (!userId) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Update contact
        const body = await request.json();
        const result = updateSchema.safeParse(body);

        if (!result.success) {
          return new Response(
            JSON.stringify({ error: "Invalid status" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        const contactId = parseInt(params.id, 10);
        await updateContactStatus(db, contactId, result.data.status);

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
