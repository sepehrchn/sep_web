import { createFileRoute } from "@tanstack/react-router";
import { getDevEnv } from "@/lib/platform";
import { getDb } from "@/lib/db/client";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const reqBody = await request.json();
          const { message, history = [] } = reqBody as { message?: string; history?: any[] };

          if (!message) {
            return new Response(
              JSON.stringify({ error: "message is required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Resolve runtime env (DB, secrets) using helper that works in Pages/Workers
          let apiKey: string | undefined;
          try {
            const env = await getDevEnv();
            // Prefer binding on env (Cloudflare Pages runtime)
            apiKey = env?.GEMINI_API_KEY ?? env?.GEMINI_API_KEY?.toString?.();
            // store env for later DB logging
            (request as any).__runtime_env = env;
          } catch (e) {
            // fallback to process.env (some runtimes may expose this)
            apiKey = process.env.GEMINI_API_KEY as any;
          }

          if (!apiKey) {
            console.error("GEMINI_API_KEY not set via getDevEnv or process.env");
            return new Response(
              JSON.stringify({ reply: "Configuration error: no API key." }),
              { status: 500, headers: { "Content-Type": "application/json" } }
            );
          }

          // Load knowledge.txt from same origin as request
          let knowledge = "";
          try {
            const kUrl = new URL('/knowledge.txt', request.url).toString();
            const kRes = await fetch(kUrl);
            if (kRes.ok) knowledge = await kRes.text();
          } catch (e) {
            console.error("knowledge.txt load failed:", e);
          }

          // Build Gemini request payload
          const contents = [
            ...history,
            { role: 'user', parts: [{ text: message }] },
          ];

          // Try a set of preferred models and fall back if one fails (quota, not available, etc.)
          const preferredModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
          let reply: string | null = null;
          let lastRawBody: string | null = null;

          function extractTextFromCandidates(body: any): string | null {
            if (!body || !Array.isArray(body.candidates) || body.candidates.length === 0) return null;
            const candidate = body.candidates[0];
            const content = candidate.content;
            if (!content) return null;
            // common case: content is an object with `parts: [{ text }]`
            if (content && typeof content === 'object' && Array.isArray(content.parts)) {
              return content.parts.map((p: any) => p?.text || '').join('');
            }
            if (typeof content === 'string') return content;
            if (Array.isArray(content)) {
              return content
                .map((part: any) => {
                  if (!part) return '';
                  if (typeof part === 'string') return part;
                  if (typeof part.text === 'string') return part.text;
                  if (Array.isArray(part.parts)) return part.parts.map((p: any) => p.text || '').join('');
                  if (Array.isArray(part.content)) return extractTextFromCandidates({ candidates: [{ content: part.content }] });
                  return '';
                })
                .join('');
            }
            try { return String(content); } catch (e) { return null; }
          }

          for (const modelName of preferredModels) {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelName)}:generateContent`;
            try {
              const res = await fetch(`${geminiUrl}?key=${encodeURIComponent(apiKey)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ system_instruction: { parts: [{ text: knowledge }] }, contents }),
              });

              const raw = await res.text().catch(() => null);
              lastRawBody = raw;
              console.log('GEMINI_MODEL:', modelName, 'GEMINI_STATUS:', res.status);
              console.log('GEMINI_BODY:', raw);

              let parsed: any = null;
              try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = null; }

              if (!res.ok) {
                // continue to next model if non-OK (quota, etc.)
                continue;
              }

              const candidateText = extractTextFromCandidates(parsed);
              if (candidateText) {
                reply = candidateText;
                break;
              }
              // otherwise try next model
            } catch (e) {
              console.error('Gemini request error for model', modelName, e);
              // try next model
            }
          }

          if (!reply) {
            // no reply produced by any model
            return new Response(JSON.stringify({ reply: 'Sorry, I could not generate a response.' }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Non-blocking D1 logging using env resolved earlier
          (async () => {
            try {
              const env = (request as any).__runtime_env ?? (await getDevEnv());
              const db = getDb(env);
              const sessionId = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : String(Date.now());
              const now = Date.now();
              await db.batch([
                db.prepare('INSERT INTO conversations (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
                  .bind((crypto as any).randomUUID(), sessionId, 'user', message, now),
                db.prepare('INSERT INTO conversations (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
                  .bind((crypto as any).randomUUID(), sessionId, 'assistant', reply, now),
              ]);
            } catch (dbErr) {
              console.error('D1 logging failed:', dbErr);
            }
          })();

          return new Response(JSON.stringify({ reply }), {
            headers: { 'Content-Type': 'application/json' },
          });

        } catch (err: any) {
          console.error('CHAT_ERROR:', err?.message ?? err);
          return new Response(
            JSON.stringify({ reply: 'Error: ' + (err?.message ?? String(err)) }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      },
    },
  },
});
