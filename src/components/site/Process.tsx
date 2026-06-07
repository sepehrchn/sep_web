import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export function Process() {
  const { t } = useTranslation();
  const steps = t('process.steps') || [];

  return (
    <section id="process" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">{t('process.label')}</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">{t('process.title')}</h2>
        </motion.div>

        <div className="relative mt-16 pl-8 md:pl-12">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent md:left-4" />
          <div className="space-y-12">
            {steps.map((s: any, i: number) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)] md:-left-[34px]" />
                <div className="font-mono-ui text-xs text-accent">{s.number}</div>
                <h3 className="font-display mt-1 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
