import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getDb } from "@/lib/db/client";
import { verifyPassword, createSession } from "@/lib/auth";
import { getDevEnv } from "@/lib/platform";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const env = await getDevEnv();
          const db = getDb(env);
          
          const formData = await request.formData();
          const body = Object.fromEntries(formData);
          const result = loginSchema.safeParse(body);

          if (!result.success) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { username, password } = result.data;

          const user = await db
            .prepare(`SELECT id, password_hash FROM admin_users WHERE username = ?`)
            .bind(username)
            .first<{ id: number; password_hash: string }>();

          if (!user || !(await verifyPassword(password, user.password_hash))) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Create and store session in database
          const sessionId = await createSession(db, user.id);

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": `admin_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
            },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
