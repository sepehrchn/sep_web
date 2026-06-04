import { motion } from "framer-motion";

const languages = [
  { code: "EN", name: "English" },
  { code: "HY", name: "Armenian" },
  { code: "RU", name: "Russian" },
  { code: "FA", name: "Persian" },
  { code: "DE", name: "German" },
  { code: "FR", name: "French" },
];

export function MultilingualBand() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-[var(--border)] bg-bg-card p-8 md:p-12"
        >
          <div className="font-mono-ui text-xs uppercase tracking-wider text-accent">
            // multilingual delivery
          </div>
          <h3 className="font-display mt-3 text-2xl font-bold md:text-3xl">
            Production sites shipped in 5+ languages.
          </h3>
          <p className="mt-3 max-w-3xl text-base text-text-secondary">
            SEO-optimised per market. Full localisation — copy, currency, legal.
            Including complex right-to-left (RTL) layout engines with sub-180ms page-load transitions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {languages.map((lang, i) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-bg px-4 py-2.5"
              >
                <span className="font-mono-ui text-sm font-semibold text-accent">{lang.code}</span>
                <span className="text-sm text-text-secondary">{lang.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
