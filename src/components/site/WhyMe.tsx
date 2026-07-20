import { motion } from "framer-motion";
import { Zap, Bot, Code2, Rocket, type LucideIcon } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { useTranslation } from "@/hooks/useTranslation";

interface Item {
  Icon: LucideIcon;
  title: string;
  body: string;
}

export function WhyMe() {
  const { t } = useTranslation();

  const items: Item[] = [
    {
      Icon: Zap,
      title: t('whyMe.items.0.title'),
      body: t('whyMe.items.0.body'),
    },
    {
      Icon: Bot,
      title: t('whyMe.items.1.title'),
      body: t('whyMe.items.1.body'),
    },
    {
      Icon: Code2,
      title: t('whyMe.items.2.title'),
      body: t('whyMe.items.2.body'),
    },
    {
      Icon: Rocket,
      title: t('whyMe.items.3.title'),
      body: t('whyMe.items.3.body'),
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">{t('whyMe.label')}</div>
          <h2 className="font-display mt-4 text-3xl sm:text-4xl font-bold leading-tight md:text-5xl">
            {t('whyMe.heading1')}
            <br />
            <span className="text-accent">{t('whyMe.heading2')}</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base text-text-secondary md:text-lg">
            {t('whyMe.subheading')}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2" style={{ perspective: 1200 }}>
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard className="group h-full">
                <div className="h-full rounded-xl border border-[var(--border)] bg-bg-card p-7 transition-all duration-300 group-hover:border-[var(--border-hover)] group-hover:shadow-[0_0_24px_var(--accent-glow)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-accent/10 text-accent">
                    <it.Icon size={20} />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-semibold">{it.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{it.body}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
