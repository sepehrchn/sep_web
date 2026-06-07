import { motion } from "framer-motion";
import { CountUp } from "./CountUp";
import { useTranslation } from "@/hooks/useTranslation";

const stats = [
  { value: 5, suffix: "", key: "stat1" },
  { value: 24, suffix: "h", key: "stat2" },
  { value: 100, suffix: "", prefix: "$", key: "stat3" },
];

export function ValueStrip() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-[var(--border)] bg-bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[var(--border)] px-6 py-16 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="px-6 py-6 text-center md:py-0"
          >
            <div className="font-mono-ui text-5xl font-semibold text-accent md:text-[56px]">
              {s.prefix ? <span className="mr-1 align-middle">{s.prefix}</span> : null}
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-base font-medium text-text-primary">{t(`valueStrip.${s.key}.label`)}</div>
            <div className="mt-1 text-sm text-text-tertiary">{t(`valueStrip.${s.key}.sub`)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
