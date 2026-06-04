import { motion } from "framer-motion";
import { HeroParticles } from "./HeroParticles";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

export function Hero() {
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="dot-grid absolute inset-0 opacity-[0.04]" />
      <HeroParticles />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="font-mono-ui text-sm text-accent">
          <Typewriter text="// full-stack developer — Yerevan, Armenia" />
        </div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="font-display mt-6 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl"
        >
          Ship faster.
          <br />
          Pay less.
          <br />
          <span className="text-accent">No middlemen.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-[580px] text-lg text-text-secondary md:text-xl"
        >
          One full-stack developer who handles everything — from design to deployment.
          Direct communication, honest pricing, and results that speak louder than promises.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.8 }}
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-bg-card/60 px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-sm text-text-secondary">Available for new projects</span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 1 }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <MagneticButton
            onClick={() => scrollTo("#work")}
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white shadow-[0_0_24px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
          >
            See My Work →
          </MagneticButton>
          <button
            onClick={() => scrollTo("#contact")}
            className="text-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
          >
            Get in Touch
          </button>
        </motion.div>
      </div>
    </section>
  );
}
