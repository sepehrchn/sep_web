import { motion } from "framer-motion";
import { Typewriter } from "./Typewriter";
import { MagneticButton } from "./MagneticButton";
import { WaveDivider } from "./WaveDivider";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const { t } = useTranslation();
  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden bg-bg pt-28">
      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 opacity-[0.6]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
          {/* Right column — visual blob image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Copper ring accent */}
              <div className="absolute -inset-4 rounded-full border-4 border-[var(--accent)] opacity-20" />

              {/* Blob-masked image/visual */}
              <div
                className="blob-mask relative h-[320px] w-[320px] overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] shadow-xl md:h-[420px] md:w-[420px]"
                style={{ animation: "float 8s ease-in-out infinite" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="font-script text-5xl md:text-7xl mb-2">سپهر</div>
                    <div className="font-mono-ui text-xs tracking-widest opacity-80">FULL-STACK DEVELOPER</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Left column — content */}
          <div className="order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="label-mono"
            >
              <Typewriter text={t('hero.typewriter')} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display mt-6 text-4xl font-bold leading-tight md:text-6xl text-[var(--primary)]"
            >
              {t('hero.heading1')}
              <br />
              {t('hero.heading2')}
              <br />
              <span className="text-[var(--accent)]">{t('hero.heading3')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 max-w-[520px] text-base text-text-secondary md:text-lg leading-relaxed"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <MagneticButton
                onClick={() => scrollTo("#work")}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-medium text-white shadow-[var(--shadow-glow)] hover:bg-[var(--accent-hover)] transition-all"
              >
                {t('hero.cta1')}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <button
                onClick={() => scrollTo("#contact")}
                className="inline-flex items-center gap-2 text-sm text-text-secondary underline-offset-4 hover:text-[var(--accent)] hover:underline transition-colors font-medium"
              >
                <Sparkles size={14} className="text-[var(--accent-cool)]" />
                {t('hero.cta2')}
              </button>
            </motion.div>

            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-5 py-2.5 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--c-success)] opacity-70" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--c-success)]" />
              </span>
              <span className="text-sm text-text-secondary font-medium">{t('hero.status')}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wavy transition to next section */}
      <WaveDivider color="#FAFAFA" height={60} />
    </section>
  );
}