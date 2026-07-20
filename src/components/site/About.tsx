import { motion } from "framer-motion";
import { WaveDivider } from "./WaveDivider";
import { useTranslation } from "@/hooks/useTranslation";

export function About() {
  const { t } = useTranslation();
  const sidebar = t('about.sidebar') || [];

  return (
    <section id="about" className="relative bg-[var(--bg-card)] py-16 sm:py-20 md:py-28 overflow-hidden">
      {/* Wavy top divider */}
      <div className="absolute top-0 left-0 right-0">
        <WaveDivider color="#EDE6D8" height={60} flip />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 md:gap-12 grid-cols-1 md:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="label-mono">{t('about.label')}</div>
            <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold leading-tight md:text-5xl text-[var(--primary)]">{t('about.title')}</h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary md:text-lg">
              <p>{t('about.description')}</p>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
          >
            <div className="label-mono">// snapshot</div>
            <dl className="mt-5 divide-y divide-[var(--border)]">
              {sidebar.map((pair: any) => (
                pair[0] ? (
                  <div key={pair[0]} className="flex items-start justify-between gap-4 py-3">
                    <dt className="font-mono-ui text-xs text-text-tertiary">{pair[0]}</dt>
                    <dd className="text-right text-sm text-text-primary font-medium">{pair[1]}</dd>
                  </div>
                ) : null
              ))}
            </dl>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}