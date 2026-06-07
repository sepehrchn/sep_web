import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export function Skills() {
  const { t } = useTranslation();
  const groups = t('skills.groups') || [];

  return (
    <section id="skills" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">{t('skills.label')}</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">{t('skills.title')}</h2>
        </motion.div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {groups.map((g: any, gi: number) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
            >
              <div className="font-mono-ui text-sm text-accent">{g.label}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((s: string, i: number) => (
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
