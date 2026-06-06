import { createFileRoute } from "@tanstack/react-router";
import OpenAI from "openai";
import { checkRequestSize, checkOrigin } from "@/lib/request-validation";
import { getDevEnv } from "@/lib/platform";
import { checkRateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are the intake assistant for Sepehr, a senior software engineer and web developer based in Yerevan, Armenia. You pre-qualify project inquiries on his behalf.

Your job: identify if the visitor is a fit, gather the information needed to start a scoping call, and route them to the contact form if they qualify. You are not customer support. You do not troubleshoot existing products.

Personality: Direct, technically confident. No filler phrases. No enthusiasm for its own sake. You ask one question at a time. You never ask for information you already have.

Sepehr's services (reference only — use natural language, not this list verbatim):
- Web design implementation for agencies (white-label, clean handoff)
- Frontend systems and performance work
- Automation and integrations (APIs, Zapier, Make, custom webhooks)
- Practical AI features (content generation, data processing, support automation)
- MVP builds: fixed scope, fixed price, 4-8 weeks

Typical project range: $8K–$50K. Engagements below $8K are not in scope.

Qualified visitor signals: agency looking for a subcontractor, business needing a lead-gen site or automation, technical founder needing frontend or integration work.

Disqualified visitor signals: pre-seed startup with no budget, looking for co-founder equity arrangement, wants general IT support or maintenance only, budget under $8K.

If disqualified: be honest and brief. Say it's not the right fit and wish them well. Do not apologize excessively.

Conversation flow (adapt to what the visitor volunteers — skip steps if already answered):
1. What they're building or need
2. Current state (existing site/system or greenfield)
3. Rough timeline
4. Budget range (offer options: Under $8K / $8K–$20K / $20K–$50K / Over $50K)
5. Name and company if not given

Once you have all five, respond with a summary of what you understood and tell the visitor to use the contact form to start a formal inquiry. The form link is #contact. You may say: 'Based on what you've told me, this sounds like a fit. Head to the contact form below — I'll get back to you within 24 hours.'

Voice rules:
- Never say: seamless, innovative, cutting-edge, passionate, world-class, synergy
- Never say: 'Great question!', 'Absolutely!', 'Of course!', 'How can I help you today?'
- CTAs use action verbs with objects: 'Start a project' not 'Get started'
- Responses are 1-4 sentences maximum. Never write paragraphs.
- Do not repeat the visitor's words back to them as a preamble.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Security checks
        const sizeCheck = checkRequestSize(request);
        if (sizeCheck) return sizeCheck;
        
        const originCheck = checkOrigin(request);
        if (originCheck) return originCheck;

        try {
          // 1. Rate limiting
          const ip = request.headers.get("cf-connecting-ip") || "127.0.0.1";
          const env = await getDevEnv();
          const rateLimit = await checkRateLimit(env.RATE_LIMIT, ip);
          
          if (!rateLimit.allowed) {
            return new Response(
              JSON.stringify({ error: "Too many messages. Please use the contact form." }),
              { status: 429, headers: { "Content-Type": "application/json" } }
            );
          }

          // 2. Parse
          const body = (await request.json()) as { messages?: Array<{ role: string; content: string }> };
          const messages = body.messages;
          if (!messages || !Array.isArray(messages)) {
            return new Response(
              JSON.stringify({ error: "Invalid payload: messages array is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // 3. Sanitize + redact PII
          const slicedMessages = messages.slice(-20);
          const sanitized: Array<{ role: "user" | "assistant" | "system"; content: string }> = [
            { role: "system", content: SYSTEM_PROMPT },
          ];

          // Basic PII redaction to avoid sending emails/phones/CC-like numbers to OpenAI
          const redactPII = (text: string) => {
            if (!text) return text;
            // redact emails
            text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]");
            // redact phone numbers (simple patterns)
            text = text.replace(/\+?\d[\d\-\s()]{6,}\d/g, "[REDACTED_PHONE]");
            // redact long digit sequences (possible CC / tokens)
            text = text.replace(/\b\d{12,19}\b/g, "[REDACTED_NUMBER]");
            return text;
          };
          for (const msg of slicedMessages) {
            if (msg.role !== "user" && msg.role !== "assistant") continue;
            if (msg.role === "user" && msg.content.length > 500) {
              return new Response(
                JSON.stringify({ error: "Message exceeds character limit of 500." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }
            const content = msg.role === "user" ? redactPII(String(msg.content)) : String(msg.content);
            sanitized.push({ role: msg.role, content });
          }

          // 4. OpenAI or placeholder
          const apiKey = process.env.OPENAI_API_KEY || "";
          const isPlaceholder = !apiKey || apiKey === "" || apiKey.includes("placeholder");

          if (isPlaceholder) {
            const userMsgs = sanitized.filter((m) => m.role === "user");
            const stepIndex = userMsgs.length;
            let replyText = "";
            if (stepIndex === 1) {
              replyText = "That sounds interesting. Is this a brand new greenfield project, or are we adding to/overhauling an existing system?";
            } else if (stepIndex === 2) {
              replyText = "Understood. What is your target timeline for starting and launching this project?";
            } else if (stepIndex === 3) {
              replyText = "Got it. What is your estimated budget range for this work? The typical options are: Under $8K, $8K–$20K, $20K–$50K, or Over $50K.";
            } else if (stepIndex === 4) {
              replyText = "Perfect. Could you also share your name and company name if you have one?";
            } else {
              const name =
                userMsgs
                  .map((m) => m.content.match(/\b(?:my name is|i am|i'm)\s+([A-Z][a-z]+)/i))
                  .filter(Boolean)[0]?.[1] || "there";
              replyText = `Thanks ${name}! I've noted down all the details of your request. Based on what you've shared, this sounds like a great fit for my services. Please use the contact form below to submit your inquiry, and I'll follow up within 24 hours.`;
            }

            const encoder = new TextEncoder();
            const stream = new ReadableStream({
              async start(controller) {
                const words = replyText.split(" ");
                for (let i = 0; i < words.length; i++) {
                  const chunk = words[i] + (i === words.length - 1 ? "" : " ");
                  controller.enqueue(encoder.encode(chunk));
                  await new Promise((r) => setTimeout(r, 40));
                }
                controller.close();
              },
            });
            return new Response(stream, {
              headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
            });
          }

          const openai = new OpenAI({ apiKey });
          const streamResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: sanitized,
            stream: true,
            max_tokens: 300,
            temperature: 0.4,
          });

          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            async start(controller) {
              try {
                for await (const chunk of streamResponse) {
                  const text = chunk.choices[0]?.delta?.content || "";
                  if (text) controller.enqueue(encoder.encode(text));
                }
                controller.close();
              } catch (err) {
                controller.error(err);
              }
            },
          });

          return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
          });
        } catch (err) {
          // Temporary debug: log a short, non-secret error marker for diagnostics
          try {
            const msg = err && (err as any).message ? (err as any).message : String(err);
            console.error("[CHAT-DEBUG-ERR]", msg);
          } catch (e) {
            console.error("[CHAT-DEBUG-ERR] (failed to stringify error)");
          }

          console.error("Chat API Error:", err);
          return new Response(
            JSON.stringify({ error: "Service unavailable. Please use the contact form." }),
            { status: 503, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
