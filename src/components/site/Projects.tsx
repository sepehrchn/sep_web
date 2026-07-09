import { useState } from "react";
import { motion } from "framer-motion";
import { JigsawCard } from "./JigsawCard";
import { ProjectImageSlider } from "./ProjectImageSlider";
import { WaveDivider } from "./WaveDivider";
import { useTranslation } from "@/hooks/useTranslation";

type Filter = "all" | "web" | "ai" | "mobile";

export function Projects() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("all");
  const rawProjects = t('projects.list');
  const projects: any[] = rawProjects ? Object.values(rawProjects) : [];
  const rawCategories = t('projects.categories');
  const categories: { value: Filter; label: string }[] = rawCategories
    ? Object.entries(rawCategories).map(([value, label]) => ({ value: value as Filter, label: label as string }))
    : [
      { value: "all", label: "All" },
      { value: "web", label: "Web" },
      { value: "ai", label: "AI/ML" },
      { value: "mobile", label: "Mobile" },
    ] as { value: Filter; label: string }[];

  return (
    <section id="work" className="relative bg-[var(--bg-card)] py-28 overflow-hidden">
      {/* Wavy top divider */}
      <div className="absolute top-0 left-0 right-0">
        <WaveDivider color="#FAFAFA" height={60} flip />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="label-mono">{t('projects.label')}</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl text-[var(--primary)]">{t('projects.title')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-text-secondary md:text-lg">{t('projects.description')}</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${filter === cat.value
                ? "bg-[var(--primary)] text-white shadow-md"
                : "border border-[var(--border)] bg-white text-text-secondary hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Projects grid with jigsaw cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((p) => filter === "all" || (p.category && p.category === filter))
            .map((p, i) => (
              <motion.div
                key={p.title || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative"
              >
                <JigsawCard color={p.color} filled className="overflow-hidden">
                  {/* Image slider - full bleed at top */}
                  {p.images && p.images.length > 0 && (
                    <ProjectImageSlider images={p.images} alt={p.title} />
                  )}

                  {/* Padded content area */}
                  <div className="p-8">
                    <div className="flex h-full flex-col">
                      {/* Top color accent bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-2"
                        style={{ backgroundColor: p.color || "#1B1B4A" }}
                      />

                      {/* Badge */}
                      {p.badge && (
                        <div className="inline-flex items-center gap-1 self-start rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-3 py-1">
                          <span className="text-xs font-medium text-[var(--accent)]">★ {p.badge}</span>
                        </div>
                      )}

                      {/* Card content */}
                      <div className="mt-auto flex flex-1 flex-col justify-end">
                        <h3 className="font-display text-xl font-bold text-white mt-4">{p.title}</h3>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">{p.description}</p>
                        {p.tags && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {p.tags.map((tag: string, j: number) => (
                              <span key={j} className="text-xs text-white/60 font-mono-ui">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom accent dot */}
                      <div className="mt-4 flex gap-1">
                        {[1, 2, 3].map((d) => (
                          <div key={d} className={`h-1.5 rounded-full ${d === 1 ? "w-6 bg-white/80" : "w-1.5 bg-white/40"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </JigsawCard>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}