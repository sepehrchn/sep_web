import { motion } from "framer-motion";

const focus = [
  "Full-stack implementation from Figma or spec",
  "3D WebGL interfaces (Three.js + React Three Fiber)",
  "Practical AI integration backed by genuine ML understanding",
  "Multi-language deployment: EN, HY, RU, FA, DE, FR",
];

const sidebar = [
  ["Based in", "Yerevan, Armenia 🇦🇲"],
  ["Availability", "Open to new work"],
  ["Response", "Within 24 hours"],
  ["Timezone", "GMT+4 (Armenia Standard)"],
  ["Degree", "B.Sc. Artificial Intelligence"],
  ["Languages", "English · Armenian · Farsi"],
];

export function About() {
  return (
    <section id="about" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-mono-ui text-sm text-accent">// about</div>
            <h2 className="font-display mt-4 text-4xl font-bold leading-tight md:text-5xl">
              One Developer. Full Ownership.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary md:text-lg">
              <p>
                I'm Sepehr — a full-stack developer based in Yerevan, Armenia, with a Bachelor's degree in Artificial
                Intelligence (ML + NLP focus). I build production websites and internal tools for agencies and
                businesses worldwide.
              </p>
              <p>
                I work solo by design. It means you deal directly with the person writing your code. No account
                managers, no handoff to juniors, no communication overhead. What we agree on is what gets built.
              </p>
              <p>
                My AI degree isn't a talking point — it's the reason my integrations work properly instead of just
                barely working.
              </p>
            </div>

            <ul className="mt-8 space-y-2">
              {focus.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-text-secondary md:text-base">
                  <span className="text-accent">→</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-xl border border-[var(--border)] bg-bg-card p-6"
          >
            <div className="font-mono-ui text-xs uppercase tracking-wider text-accent">// snapshot</div>
            <dl className="mt-5 divide-y divide-[var(--border)]">
              {sidebar.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-mono-ui text-xs text-text-tertiary">{k}</dt>
                  <dd className="text-right text-sm text-text-primary">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
