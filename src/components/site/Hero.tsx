import { motion } from "framer-motion";
import { HeroParticles } from "./HeroParticles";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";
import { useTranslation } from "@/hooks/useTranslation";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
} as const;

export function Hero() {
  const { t } = useTranslation();
  
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="dot-grid absolute inset-0 opacity-[0.04]" />
      <HeroParticles />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="font-mono-ui text-sm text-accent">
          <Typewriter text={t('hero.typewriter')} />
        </div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
          className="font-display mt-6 text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl"
        >
          {t('hero.heading1')}
          <br />
          {t('hero.heading2')}
          <br />
          <span className="text-accent">{t('hero.heading3')}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6 }}
          className="mt-8 max-w-[580px] text-lg text-text-secondary md:text-xl"
        >
          {t('hero.description')}
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
          <span className="text-sm text-text-secondary">{t('hero.status')}</span>
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
            {t('hero.cta1')}
          </MagneticButton>
          <button
            onClick={() => scrollTo("#contact")}
            className="text-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
          >
            {t('hero.cta2')}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
