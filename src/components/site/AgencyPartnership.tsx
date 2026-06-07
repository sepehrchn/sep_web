import { motion } from "framer-motion";
import { Shield, FileCheck, Handshake, FileText } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const icons = [Shield, FileCheck, Handshake, FileText];

export function AgencyPartnership() {
  const { t } = useTranslation();
  const items = t('agency.items') || [];

  return (
    <section className="border-y border-[var(--border)] bg-bg-card/30 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">{t('agency.label')}</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">{t('agency.heading')}</h2>
          <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">{t('agency.sub')}</p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((f: any, i: number) => {
            const Icon = icons[i] || icons[0];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-[var(--border)] bg-bg p-6 transition-all hover:border-[var(--border-hover)] hover:shadow-[0_0_16px_var(--accent-glow)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-accent/10 text-accent">
                  <Icon size={18} />
                </div>
                <h3 className="font-display mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
