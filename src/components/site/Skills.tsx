import { motion } from "framer-motion";
import { JigsawCard } from "./JigsawCard";
import { WaveDivider } from "./WaveDivider";
import { useTranslation } from "@/hooks/useTranslation";

const PALETTE = [
  "#1B4D3E",
  "#2A7B8C",
  "#C17A54",
  "#1B1B4A",
  "#5C6B3C",
  "#6B4E8D",
  "#B8860B",
];

export function Skills() {
  const { t } = useTranslation();
  const groups = t('skills.groups') || [];

  return (
    <section id="skills" className="relative bg-bg py-16 sm:py-20 md:py-28 overflow-hidden">
      {/* Wavy top divider */}
      <div className="absolute top-0 left-0 right-0">
        <WaveDivider color="#EDE6D8" height={60} flip />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="label-mono">{t('skills.label')}</div>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold md:text-5xl text-[var(--primary)]">{t('skills.title')}</h2>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {groups.map((g: any, gi: number) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
            >
              <JigsawCard color={PALETTE[gi % PALETTE.length]} className="h-full">
                <div className="flex h-full flex-col p-8">
                  {/* Skill tag & label */}
                  <h3 className="font-display text-2xl font-bold text-[var(--primary)] leading-tight">{g.title || g.label}</h3>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed flex-1">{g.description || ''}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((s: string, i: number) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: gi * 0.08 + i * 0.04 }}
                        className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs text-text-secondary transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        {s}
                      </motion.span>
                    ))}
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