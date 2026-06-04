import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";
import { validateAdminSession, createUnauthorizedResponse } from "@/lib/auth-middleware";
import { updateContactStatus } from "@/lib/db/queries";

const updateSchema = z.object({
  status: z.enum(["new", "contacted", "in_progress", "completed", "archived"]),
});

export const Route = createFileRoute("/api/admin/contacts/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        // Authenticate request
        const env = await getDevEnv();
        const db = getDb(env);
        const authResult = await validateAdminSession(db, request);

        if (!authResult.authenticated) {
          return createUnauthorizedResponse(authResult.error);
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
