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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-[20px] bg-[rgba(15,16,21,0.6)] border-b border-[var(--border)]" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#" className="font-mono-ui text-base text-accent">
          {t('nav.logoLabel')}<span className="blink">_</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l: any) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <MagneticButton
            onClick={() => scrollTo("#contact")}
            className="rounded-md border border-accent bg-accent/10 px-4 py-2 text-sm text-text-primary transition-colors hover:bg-accent/20"
          >
            {t('nav.cta')}
          </MagneticButton>
        </div>

        <button className="md:hidden text-text-primary" onClick={() => setOpen(true)} aria-label="Menu">
          <Menu size={22} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-bg-card border-l border-[var(--border)] p-6 md:hidden"
          >
            <div className="flex justify-between items-center">
              <LanguageSwitcher />
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-6">
              {navLinks.map((l: any) => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-lg text-text-primary">
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("#contact")}
                className="mt-4 rounded-md border border-accent bg-accent/10 px-4 py-3 text-sm"
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
