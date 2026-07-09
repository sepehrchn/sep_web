import { motion } from "framer-motion";
import { Layout, Workflow, Cpu, type LucideIcon } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { useTranslation } from "@/hooks/useTranslation";

interface Service {
  Icon: LucideIcon;
  title: string;
  body: string;
  tags: string[];
}

export function Services() {
  const { t } = useTranslation();

  const services: Service[] = [
    {
      Icon: Layout,
      title: t('services.items.0.title'),
      body: t('services.items.0.body'),
      tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Vercel"],
    },
    {
      Icon: Workflow,
      title: t('services.items.1.title'),
      body: t('services.items.1.body'),
      tags: ["Zapier", "Make", "REST APIs", "Webhooks", "Node.js"],
    },
    {
      Icon: Cpu,
      title: t('services.items.2.title'),
      body: t('services.items.2.body'),
      tags: ["OpenAI API", "TypeScript", "Next.js", "Server Actions"],
    },
  ];

  return (
    <section id="services" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">{t('services.label')}</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">{t('services.title')}</h2>
          <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
            {t('services.description')}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3" style={{ perspective: 1200 }}>
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <TiltCard className="group h-full">
                <div className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-bg-card p-7 transition-all duration-300 group-hover:border-[var(--border-hover)] group-hover:shadow-[0_0_24px_var(--accent-glow)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-accent/10 text-accent">
                    <s.Icon size={20} />
                  </div>
                  <h3 className="font-display mt-5 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{s.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[#C17A54]/40 bg-[#C17A54]/10 px-2.5 py-1 font-mono-ui text-[11px] text-[#C17A54]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
