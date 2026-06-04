import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Discovery (Free, 30 min)",
    body: "Quick call. I understand your needs, timeline, and constraints. You understand how I work. We assess if it's a good fit.",
  },
  {
    n: "02",
    title: "Proposal & Contract",
    body: "Written proposal: fixed scope, fixed price, fixed deadline. No range estimates. You know the cost before a line is written. Agencies: white-label + NDA available.",
  },
  {
    n: "03",
    title: "Development",
    body: "Weekly check-ins. Working code deployed to staging every sprint. Direct access to me — no project manager between us.",
  },
  {
    n: "04",
    title: "Handoff & Support",
    body: "Deployed to production. Full documentation. 30-day post-launch support included. You own everything: code, repo, domain, accounts.",
  },
];

export function Process() {
  return (
    <section id="process" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">// how we work</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">Clear Process. Zero Surprises.</h2>
          <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
            Whether you're an agency subcontracting or a business starting a project.
          </p>
        </motion.div>

        <div className="relative mt-16 pl-8 md:pl-12">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent md:left-4" />
          <div className="space-y-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)] md:-left-[34px]" />
                <div className="font-mono-ui text-xs text-accent">{s.n}</div>
                <h3 className="font-display mt-1 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
