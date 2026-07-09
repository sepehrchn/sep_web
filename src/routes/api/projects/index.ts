import { createFileRoute } from "@tanstack/react-router";

const keyMapping: Record<string, string> = {
  "ShahMaghz": "shahmaghz",
  "Cyberbullying": "cyberbullying",
  "Ariana": "ariana",
  "FORMA": "forma",
  "Telegram": "telegram",
  "n8n": "n8n",
  "Ariana Global Trade — B2B Export Portal": "ariana",
  "FORMA Studio — Art Direction & Advertising": "forma"
};

export const Route = createFileRoute("/api/projects/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          // Try environment binding first
          try {
            const { getDevEnv } = await import("@/lib/platform");
            const { getDb } = await import("@/lib/db/client");
            const { getVisibleProjects } = await import("@/lib/db/projects-queries");
            
            const env = await getDevEnv();
            const db = getDb(env);
            const projects = await getVisibleProjects(db);

            if (projects && projects.length > 0) {
              const transformed = projects.map((p) => {
                const matchedKey = Object.keys(keyMapping).find(k => p.title.includes(k));
                const key = matchedKey ? keyMapping[matchedKey] : p.title.toLowerCase().replace(/[^a-z0-9]/g, "");
                return {
                  key,
                  url: p.url,
                  bgClass: p.bg_class,
                  centerText: p.center_text,
                  category: p.category,
                  title: p.title,
                  description: p.description,
                  highlights: p.highlights,
                  tags: p.tags,
                  github: p.github,
                  demo: p.demo,
                  screenshots: p.screenshots,
                };
              });

              return new Response(JSON.stringify(transformed), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            }
          } catch (bindingError) {
            // Binding not available; fall back to hardcoded projects below
          }

          // Fallback: Return hardcoded data based on what's in the DB
          const hardcodedProjects = [
            {
              key: "shahmaghz",
              url: "shahmaghz.demo",
              bgClass: "bg-gradient-to-br from-[#2D2A26] to-[#1E1C1A]",
              centerText: "ShahMaghz E-Commerce",
              category: "Full-Stack",
              title: "ShahMaghz E-Commerce Platform",
              description: "A high-performance, RTL-native agricultural e-commerce platform built with a 13-model Postgres schema, Zustand state, and Cloudinary media pipelines.",
              highlights: [
                "13-model relational schema with Prisma & PostgreSQL",
                "Fully native RTL/LTR design system and theme selector",
                "Optimized media processing and upload via Cloudinary",
                "Predictable client-side state management using Zustand"
              ],
              tags: ["Next.js 14", "TypeScript", "PostgreSQL", "Prisma", "Zustand", "Zod", "Tailwind v4", "Cloudinary"],
              github: "https://github.com/sepehrjo/shahmaghz",
              demo: "https://shahmaghz.demo",
              screenshots: []
            },
            {
              key: "cyberbullying",
              url: "cyberbullying-detector.local",
              bgClass: "bg-gradient-to-br from-[#1C1D24] to-[#111216]",
              centerText: "NLP Classifier Dashboard",
              category: "AI/ML",
              title: "Cyberbullying Classification System",
              description: "An NLP text classification system combining BERT and BiLSTM models with human-in-the-loop retraining, wrapped in a Chrome extension and FastAPI dashboard. Graded A+.",
              highlights: [
                "Hybrid BERT + BiLSTM neural network built with PyTorch",
                "Active learning loop utilizing moderator verification feedback",
                "Chrome extension for real-time social platform monitoring",
                "FastAPI backend and analytics dashboard with PostgreSQL"
              ],
              tags: ["Python", "FastAPI", "PyTorch", "Transformers", "BERT", "Chrome Extension", "React", "PostgreSQL"],
              github: "https://github.com/sepehrjo/cyberbullying-detector",
              demo: "https://cyberbullying-detector.local",
              screenshots: []
            },
            {
              key: "ariana",
              url: "arianasepehr.vercel.app",
              bgClass: "bg-gradient-to-br from-[#24211D] to-[#161412]",
              centerText: "B2B Export Platform",
              category: "Full-Stack",
              title: "Ariana Global Trade",
              description: "A bilingual B2B platform prototype highlighting an advanced RTL layout engine and a local Knowledge Base chatbot running LLM fallbacks.",
              highlights: [
                "Bilingual (EN/FA) interface with micro-interaction state transitions",
                "OpenAI-powered concierge bot with local KB context integration",
                "Robust responsive grids matching 5 viewport breakpoints"
              ],
              tags: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "OpenAI API", "RTL Support", "React 19", "Vercel"],
              github: "https://github.com/sepehrjo/ariana-b2b-export",
              demo: "https://arianasepehr.vercel.app",
              screenshots: []
            },
            {
              key: "forma",
              url: "adart-alpha.vercel.app",
              bgClass: "bg-[#0B0B0B]",
              centerText: "Creative Agency Website",
              category: "Full-Stack",
              title: "FORMA Studio Website",
              description: "A fictional design studio showcase highlighting a performance-conscious Three.js WebGL hero and 4-language i18n routing in CSS Modules.",
              highlights: [
                "Three.js WebGL rendering with off-screen GPU sleep mode",
                "Custom CSS Modules design system with zero utilities dependency",
                "Smooth framerate animation transitions using Framer Motion"
              ],
              tags: ["React 19", "TypeScript", "Three.js", "@react-three/fiber", "Framer Motion", "i18next", "RTL Support", "CSS Modules", "Vite"],
              github: "https://github.com/sepehrjo/Ad_Art_Web",
              demo: "https://adart-alpha.vercel.app",
              screenshots: []
            },
            {
              key: "telegram",
              url: "telegram-bot.edge",
              bgClass: "bg-gradient-to-br from-[#1E2530] to-[#12161E]",
              centerText: "Telegram AI Assistant",
              category: "AI/ML",
              title: "Telegram AI Assistant",
              description: "A Gemini-powered personal bot deployed on the edge, featuring ElevenLabs voice processing and live knowledge base syncing without redeploys.",
              highlights: [
                "Serverless execution using Cloudflare Workers, KV, and D1",
                "Multimodal audio translation powered by ElevenLabs voice API",
                "Dynamic context updating through real-time DB synchronization"
              ],
              tags: ["Cloudflare Workers", "D1 Database", "KV Store", "Gemini API", "ElevenLabs API", "TypeScript", "Wrangler"],
              github: "https://github.com/sepehrjo/telegram-ai-assistant",
              demo: "https://telegram-bot.edge",
              screenshots: []
            },
            {
              key: "n8n",
              url: "n8n-automation.local",
              bgClass: "bg-gradient-to-br from-[#201816] to-[#140F0E]",
              centerText: "Multi-Agent Outreach Workflow",
              category: "Automation",
              title: "Multi-Agent Outreach Automation",
              description: "A secure n8n automation pipeline conducting recursive site scraping, AI research, and automated draft synthesis with strict rate-limiting guardrails.",
              highlights: [
                "Orchestration of independent research and writing agents",
                "Dynamic rate-limiting guardrails and manual approval gates",
                "Real-time logging to spreadsheet databases and email triggers"
              ],
              tags: ["n8n", "AI Agents", "Web Scraping", "Google Sheets API", "Email API", "Workflow Automation"],
              github: "https://github.com/sepehrjo/outreach-automation",
              demo: "https://n8n-automation.local",
              screenshots: []
            }
          ];

          return new Response(JSON.stringify(hardcodedProjects), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Projects API error:", error);
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
