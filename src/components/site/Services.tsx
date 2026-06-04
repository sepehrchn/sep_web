import { motion } from "framer-motion";
import { Layout, Workflow, Cpu, type LucideIcon } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface Service {
  Icon: LucideIcon;
  title: string;
  body: string;
  tags: string[];
}

const services: Service[] = [
  {
    Icon: Layout,
    title: "Figma → Production",
    body: "I build your designs into fast, responsive websites with pixel-accurate implementation. Clean code your team can maintain. White-label available for agencies — your client never needs to know.",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Vercel"],
  },
  {
    Icon: Workflow,
    title: "Workflow Automation",
    body: "Connect your CRM, forms, email, and internal systems. Eliminate the repetitive manual tasks draining your team's time. No-code where it fits, custom code where it doesn't.",
    tags: ["Zapier", "Make", "REST APIs", "Webhooks", "Node.js"],
  },
  {
    Icon: Cpu,
    title: "AI Features That Actually Ship",
    body: "I have an AI degree backing every integration I build — chatbots, content generation, lead qualification, document processing. Real implementations, not copy-pasted tutorials.",
    tags: ["OpenAI API", "TypeScript", "Next.js", "Server Actions"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">// what i build</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">Three Ways I Can Help</h2>
          <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
            Most projects combine two or more of these. I work with agencies and businesses.
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
                        className="rounded-full border border-[var(--border)] bg-black/30 px-2.5 py-1 font-mono-ui text-[11px] text-text-tertiary"
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
