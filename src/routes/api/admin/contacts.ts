import { createFileRoute } from "@tanstack/react-router";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";
import { validateAdminSession, createUnauthorizedResponse } from "@/lib/auth-middleware";
import { getContacts } from "@/lib/db/queries";

export const Route = createFileRoute("/api/admin/contacts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Authenticate request
        const env = await getDevEnv();
        const db = getDb(env);
        const authResult = await validateAdminSession(db, request);

        if (!authResult.authenticated) {
          return createUnauthorizedResponse(authResult.error);
        }

        // Fetch contacts
        const limit = 100;
        const offset = 0;
        const contacts = await getContacts(db, limit, offset);

        return new Response(JSON.stringify({ contacts }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
