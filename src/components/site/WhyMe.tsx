import { motion } from "framer-motion";
import { Zap, Bot, DollarSign, Rocket, type LucideIcon } from "lucide-react";
import { TiltCard } from "./TiltCard";

interface Item {
  Icon: LucideIcon;
  title: string;
  body: string;
}
const items: Item[] = [
  {
    Icon: Zap,
    title: "Full-Stack, Solo",
    body: "Frontend, backend, and deployment — one person. No handoffs, no miscommunication, no \"that's the other team's problem.\" You talk directly to the developer writing your code.",
  },
  {
    Icon: Bot,
    title: "AI-Augmented Workflow",
    body: "I hold a degree in Artificial Intelligence — I understand what these models actually do, not just how to call an API. That means faster builds and smarter integrations.",
  },
  {
    Icon: DollarSign,
    title: "Yerevan Rates, European Quality",
    body: "Competitive pricing is a natural result of low overhead — not a sign of lower quality. You get senior-level architecture at a fraction of typical agency cost.",
  },
  {
    Icon: Rocket,
    title: "Demo in Days, Not Weeks",
    body: "Most clients see a working prototype within 3–5 days of kickoff. Faster feedback loops mean faster launches. Speed is a feature.",
  },
];

export function WhyMe() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">// value proposition</div>
          <h2 className="font-display mt-4 text-4xl font-bold leading-tight md:text-5xl">
            What others charge more for —
            <br />
            <span className="text-accent">I ship faster.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base text-text-secondary md:text-lg">
            Most agencies add layers of account managers, designers, and developers between you and your product.
            I remove all of that overhead — and pass the savings directly to you.
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
