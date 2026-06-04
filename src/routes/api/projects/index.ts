import { createFileRoute } from "@tanstack/react-router";
import { getDb } from "@/lib/db/client";
import { getVisibleProjects } from "@/lib/db/projects-queries";
import { getDevEnv } from "@/lib/platform";

export const Route = createFileRoute("/api/projects/")({
  server: {
    handlers: {
      GET: async () => {
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
          return new Response(JSON.stringify({ error: "Failed to load projects" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
