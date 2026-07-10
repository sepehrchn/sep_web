import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = t('nav.links') || [];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-[var(--primary)] shadow-lg border-b border-white/10" : "bg-[var(--primary)]"
        }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <nav className="flex items-center justify-between py-3">
          {/* Logo — single element */}
          <a href="/" className="group shrink-0">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] transition-all group-hover:border-[var(--accent-hover)]" />
              <div className="absolute inset-[3px] rounded-full overflow-hidden">
                <img src="/assets/logo.webp" alt="Sepehr" className="h-full w-full object-cover" />
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l: any) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm text-white/90 transition-colors hover:text-[var(--accent)] font-medium"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <MagneticButton
              onClick={() => scrollTo("#contact")}
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white shadow-md hover:bg-[var(--accent-hover)] transition-all"
            >
              {t('nav.cta')}
            </MagneticButton>
          </div>

          <button className="md:hidden text-white" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-[var(--bg-card)] border-l border-[var(--border)] p-6 md:hidden shadow-lg"
          >
            <div className="flex justify-between items-center">
              <LanguageSwitcher />
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-text-primary hover:text-accent transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-6">
              {navLinks.map((l: any) => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-lg text-text-primary hover:text-accent transition-colors">
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("#contact")}
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm text-white font-medium hover:bg-[var(--accent-hover)] transition-all"
              >
                {t('nav.cta')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}