import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "@/lib/db/client";
import { getVisibleProjects } from "@/lib/db/projects-queries";
import { getDevEnv } from "@/lib/platform";

export const Route = createFileRoute("/api/projects/")({
  server: {
    handlers: {
      GET: async () => {
        // TEMPORARY: Return hardcoded data to test frontend
        const hardcoded = [
          {
            url: "arianasepehr.vercel.app",
            bgClass: "bg-gradient-to-br from-blue-600 to-purple-700",
            centerText: "Ariana",
            category: "B2B Platform",
            title: "Ariana Global Trade — B2B Export Portal",
            description: "Multi-language B2B export platform",
            highlights: ["Multi-language", "AI chatbot", "Quote system"],
            tags: ["Next.js", "TypeScript", "Tailwind"],
            github: "https://github.com/sepehrjo/ariana-b2b-export",
            demo: "https://arianasepehr.vercel.app",
            screenshots: [
              { src: "/assets/preview-en.png", alt: "Homepage" },
              { src: "/assets/languages-support.png", alt: "Multi-language" }
            ]
          }
        ];
        
        return new Response(JSON.stringify(hardcoded), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
        
        /* Original DB code - TODO: Fix
        try {
          const env = await getDevEnv();
          const db = getDb(env);
          const projects = await getVisibleProjects(db);

          // Transform to match frontend interface
          const transformed = projects.map((p) => ({
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
          }));

          return new Response(JSON.stringify(transformed), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Projects API error:", error);
          // Return empty array instead of error object to prevent .map() errors
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        */
      },
    },
  },
});
