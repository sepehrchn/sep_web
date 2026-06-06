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
          let env;
          try {
            env = await getDevEnv();
          } catch (envErr) {
            console.error("Environment error:", envErr);
            return new Response(JSON.stringify({ error: "Database unavailable", details: String(envErr) }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          
          const db = getDb(env);
          
          const formData = await request.formData();
          const body = Object.fromEntries(formData);
          const result = loginSchema.safeParse(body);

          if (!result.success) {
            return new Response(JSON.stringify({ error: "Invalid request format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { username, password } = result.data;
          
          console.log(`[Login] Attempt for user: ${username}`);

          let user;
          try {
            user = await db
              .prepare(`SELECT id, password_hash FROM admin_users WHERE username = ?`)
              .bind(username)
              .first<{ id: number; password_hash: string }>();
            console.log(`[Login] User query result:`, user ? `Found (id=${user.id})` : "Not found");
          } catch (dbErr) {
            console.error(`[Login] Database query error:`, dbErr);
            return new Response(JSON.stringify({ error: "Database error", details: String(dbErr) }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          let passwordMatch;
          try {
            passwordMatch = await verifyPassword(password, user.password_hash);
            console.log(`[Login] Password verification result: ${passwordMatch}`);
          } catch (hashErr) {
            console.error(`[Login] Password verification error:`, hashErr);
            return new Response(JSON.stringify({ error: "Authentication error", details: String(hashErr) }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!passwordMatch) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Create and store session in database
          let sessionId;
          try {
            sessionId = await createSession(db, user.id);
            console.log(`[Login] Session created successfully`);
          } catch (sessionErr) {
            console.error(`[Login] Session creation error:`, sessionErr);
            return new Response(JSON.stringify({ error: "Session error", details: String(sessionErr) }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": `admin_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
            },
          });
        } catch (error) {
          console.error("[Login] Unexpected error:", error);
          return new Response(JSON.stringify({ error: "Unexpected error", details: String(error) }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
