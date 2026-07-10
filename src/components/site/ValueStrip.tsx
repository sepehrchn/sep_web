import { motion } from "framer-motion";
import { CountUp } from "./CountUp";
import { WaveDivider } from "./WaveDivider";
import { useTranslation } from "@/hooks/useTranslation";

const stats = [
  { value: 12, suffix: "+", key: "projects" },
  { value: 3, suffix: "+", key: "years" },
  { value: 100, suffix: "%", key: "quality" },
];

export function ValueStrip() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-[var(--primary)] py-24 overflow-hidden">
      {/* Wavy edges */}
      <div className="absolute top-0 left-0 right-0">
        <WaveDivider color="#EDE6D8" height={50} flip />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider color="#EDE6D8" height={50} />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="font-mono-ui text-5xl md:text-6xl font-bold text-white">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-sm font-semibold text-white/80">{t(`valueStrip.${s.key}.label`)}</div>
              <div className="mt-1 text-xs text-white/60">{t(`valueStrip.${s.key}.sub`)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}