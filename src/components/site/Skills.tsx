import { motion } from "framer-motion";

const groups = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML/CSS", "Vite"] },
  { label: "3D & Visual", items: ["Three.js", "@react-three/fiber", "@react-three/drei", "CSS Modules"] },
  { label: "Backend & API", items: ["Node.js", "REST APIs", "Next.js Server Actions", "Zod", "PostgreSQL"] },
  { label: "AI & Automation", items: ["OpenAI API", "LLM Integration", "Zapier", "Make", "Webhooks"] },
  { label: "Internationalisation", items: ["i18next", "react-i18next", "RTL/LTR Layouts", "Persian", "Armenian", "Russian"] },
  { label: "Deploy & Tools", items: ["Vercel", "GitHub", "Git", "Figma", "Docker"] },
];

export function Skills() {
  return (
    <section id="skills" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">// technical capabilities</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">The Stack I Ship With</h2>
        </motion.div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {groups.map((g, gi) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
            >
              <div className="font-mono-ui text-sm text-accent">{g.label}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: gi * 0.08 + i * 0.04 }}
                    className="rounded-md border border-[var(--border)] bg-bg-card px-3 py-1.5 text-sm text-text-secondary transition-all hover:border-[var(--border-hover)] hover:text-text-primary hover:shadow-[0_0_16px_var(--accent-glow)]"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
